declare const spindle: import('lumiverse-spindle-types').SpindleAPI
import { TAROT_DECK } from './tarot-data'

let cachedImageUrls: Record<number, string> = {}
let currentReadings: Map<string, any> = new Map()

async function ensureAssetsSeeded(userId: string) {
  spindle.log.info('Tarot Reader: Checking assets...')
  const storedUrls = await spindle.storage.getJson<Record<number, string> | null>('image_urls.json', { fallback: null })
  if (storedUrls && Object.keys(storedUrls).length === 79) {
    cachedImageUrls = storedUrls
    spindle.log.info(`Tarot Reader: Loaded ${Object.keys(cachedImageUrls).length} cached image URLs.`)
    return
  }

  spindle.log.info('Tarot Reader: Seeding 79 tarot images...')
  const uploadItems = []
  for (let i = 0; i <= 78; i++) {
    const filename = `${i.toString().padStart(2, '0')}.jpg`
    try {
      const data = await spindle.storage.readBinary(`assets/${filename}`)
      uploadItems.push({ data, filename, mime_type: 'image/jpeg' })
    } catch (err) { spindle.log.error(`Failed to read ${filename}.`) }
  }

  const results = await spindle.images.uploadMany(uploadItems, { userId })
  const newUrls: Record<number, string> = {}
  results.forEach((result, index) => {
    const id = uploadItems[index].filename.split('.')[0]
    if (result.id) newUrls[Number(id)] = `/api/v1/images/${result.id}?size=lg`
  })

  cachedImageUrls = newUrls
  await spindle.storage.setJson('image_urls.json', newUrls)
  spindle.log.info('Tarot Reader: Successfully seeded and cached all images.')
}

spindle.onFrontendMessage(async (payload: any, userId) => {
  if (payload.type === 'init') {
    if (Object.keys(cachedImageUrls).length === 0) await ensureAssetsSeeded(userId)

    const connections = await spindle.connections.list(userId)
    const activeChat = await spindle.chats.getActive(userId)
    const { data } = await spindle.characters.list({ limit: 200, userId })
    const characters = data

    const settings = await spindle.storage.getJson('settings.json', {
      fallback: {
        systemPrompt: "You are an expert tarot reader. Interpret the cards based on traditional meanings while considering the user's context and question. Keep the tone mystical yet clear.",
        connectionId: connections.find(c => c.is_default)?.id || ""
      }
    })

    spindle.sendToFrontend({ type: 'init_data', imageUrls: cachedImageUrls, connections, characters, activeChatId: activeChat?.id || null, settings }, userId)
  }

  if (payload.type === 'save_settings') {
    await spindle.storage.setJson('settings.json', { systemPrompt: payload.systemPrompt, connectionId: payload.connectionId })
    spindle.toast.success('Tarot settings saved!')
  }

  if (payload.type === 'draw_cards') {
    const { spreadType, variant, question, readerCharacterId } = payload
    let count = 1
    let positions: string[] = []
    
    if (spreadType === '1') { count = 1; positions = ['The Card'] }
    else if (spreadType === '3') { count = 3; positions = variant === 'ppf' ? ['Past', 'Present', 'Future'] : ['Mind', 'Body', 'Soul'] }
    else if (spreadType === '5') { count = 5; positions = ['Past', 'Present', 'Future', 'Core Reason', 'Potential'] }
    else if (spreadType === '7') { count = 7; positions = ['Past', 'Present', 'Hidden Influences', 'Obstacles', 'Potential', 'Advice', 'Potential Outcome'] }
    else if (spreadType === '10') { count = 10; positions = ['Present', 'Challenge', 'Focus', 'Past', 'Strengths', 'Near Future', 'Advice', 'Environment', 'Hopes and Fears', 'Potential Outcome'] }
    
    const available = Array.from({length: 78}, (_, i) => i)
    const drawnCards = []
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * available.length)
      const cardId = available.splice(idx, 1)[0]
      const inverted = Math.random() < 0.5
      const cardData = TAROT_DECK.find(c => c.id === cardId)
      drawnCards.push({ id: cardId, inverted, name: cardData?.name || 'Unknown' })
    }
    
    // Save reading state with empty interpretations array
    currentReadings.set(userId, { cards: drawnCards, positions, spreadType, variant, question, readerCharacterId, interpretations: [] })
    spindle.sendToFrontend({ type: 'draw_result', cards: drawnCards, positions }, userId)
  }

  if (payload.type === 'flip_card') {
    const { cardIndex } = payload
    const reading = currentReadings.get(userId)
    if (!reading) return

    const card = reading.cards[cardIndex]
    const cardData = TAROT_DECK.find(c => c.id === card.id)
    if (!cardData) return

    const settings = await spindle.storage.getJson('settings.json', { fallback: { systemPrompt: '', connectionId: '' } })
    if (!settings.connectionId) {
      spindle.toast.error('No LLM connection selected.')
      spindle.sendToFrontend({ type: 'stream_end', cardIndex, fullText: 'Error: No connection selected.' }, userId)
      return
    }

    const connection = await spindle.connections.get(settings.connectionId, userId)
    if (!connection || !connection.model) {
      spindle.toast.error('Selected connection has no model configured.')
      spindle.sendToFrontend({ type: 'stream_end', cardIndex, fullText: 'Error: Connection has no model.' }, userId)
      return
    }

    const activePersona = await spindle.personas.getActive(userId)
    const activeChat = await spindle.chats.getActive(userId)
    
    let readerCharacter = null
    let activeChatCharacter = null
    
    if (activeChat?.character_id) activeChatCharacter = await spindle.characters.get(activeChat.character_id, userId)
    if (reading.readerCharacterId && reading.readerCharacterId !== activeChat?.character_id) {
      readerCharacter = await spindle.characters.get(reading.readerCharacterId, userId)
    } else {
      readerCharacter = activeChatCharacter
    }

    let historyText = ""
    if (activeChat) {
      const messages = await spindle.chat.getMessages(activeChat.id, userId)
      const recent = messages.slice(-5)
      historyText = recent.map(m => `${m.role === 'user' ? 'User' : readerCharacter?.name || 'Assistant'}: ${m.content}`).join('\n')
    }

    let systemPrompt = `${settings.systemPrompt}\n\nYou are roleplaying as ${readerCharacter?.name || 'a tarot reader'}.`
    if (readerCharacter?.description) systemPrompt += `\n${readerCharacter.description}`
    if (readerCharacter?.personality) systemPrompt += `\nPersonality: ${readerCharacter.personality}`
    
    let userPrompt = `User Persona: ${activePersona?.name || 'Unknown'}\n${activePersona?.description || ''}\n\n`
    
    if (reading.question) {
      userPrompt += `User's Question: ${reading.question}\n\n`
    } else {
      userPrompt += `The user did not ask a specific question. Use this recent chat history as context:\n${historyText}\n\n`
      if (readerCharacter && activeChatCharacter && readerCharacter.id !== activeChatCharacter.id) {
        userPrompt += `Note: The user is currently interacting with ${activeChatCharacter.name} in their chat. Context: ${activeChatCharacter.description}\n\n`
      }
    }
    
    const position = reading.positions[cardIndex]
    const orientation = card.inverted ? 'Inverted' : 'Upright'
    const meaning = card.inverted ? cardData.inverse : cardData.upright
    
    userPrompt += `Spread: ${reading.spreadType} cards\n`
    userPrompt += `Position Meaning: ${position}\n`
    userPrompt += `Card Drawn: ${cardData.name} (${orientation})\n`
    userPrompt += `Traditional Meaning: ${meaning}\n\n`
    userPrompt += `Interpret this card for the user in 2-3 sentences.`

    spindle.sendToFrontend({ type: 'stream_start', cardIndex }, userId)

    try {
      const stream = spindle.generate.rawStream({
        connection_id: settings.connectionId,
        model: connection.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        parameters: { temperature: 0.7 },
        userId: userId
      } as any)

      let fullText = ''
      for await (const chunk of stream) {
        if (chunk.type === 'token') {
          fullText += chunk.token
          spindle.sendToFrontend({ type: 'stream_token', cardIndex, token: chunk.token }, userId)
        } else if (chunk.type === 'done') {
          fullText = chunk.content || fullText
        }
      }
      
      // Save interpretation for synthesis later
      reading.interpretations[cardIndex] = fullText
      currentReadings.set(userId, reading)
      
      spindle.sendToFrontend({ type: 'stream_end', cardIndex, fullText }, userId)
    } catch (err: any) {
      spindle.log.error(`Tarot Reader: Stream failed - ${err.message}`)
      spindle.toast.error(`Tarot generation failed: ${err.message}`)
      spindle.sendToFrontend({ type: 'stream_end', cardIndex, fullText: `Error: ${err.message}` }, userId)
    }
  }

  if (payload.type === 'synthesize') {
    const reading = currentReadings.get(userId)
    if (!reading) return

    const settings = await spindle.storage.getJson('settings.json', { fallback: { systemPrompt: '', connectionId: '' } })
    const connection = await spindle.connections.get(settings.connectionId, userId)
    if (!connection || !connection.model) return

    const activePersona = await spindle.personas.getActive(userId)
    const activeChat = await spindle.chats.getActive(userId)
    let readerCharacter = null
    if (activeChat?.character_id) {
      readerCharacter = await spindle.characters.get(activeChat.character_id, userId)
    }

    let systemPrompt = `${settings.systemPrompt}\n\nYou are roleplaying as ${readerCharacter?.name || 'a tarot reader'}.`
    if (readerCharacter?.description) systemPrompt += `\n${readerCharacter.description}`

    let userPrompt = `User Persona: ${activePersona?.name || 'Unknown'}\n\n`
    if (reading.question) userPrompt += `User's Question: ${reading.question}\n\n`
    
    userPrompt += `Here are the cards drawn and their individual interpretations:\n`
    reading.cards.forEach((card: any, i: number) => {
      const cardData = TAROT_DECK.find(c => c.id === card.id)
      const orientation = card.inverted ? 'Inverted' : 'Upright'
      userPrompt += `Position: ${reading.positions[i]} | Card: ${cardData?.name} (${orientation})\nInterpretation: ${reading.interpretations[i] || 'N/A'}\n\n`
    })
    
    userPrompt += `Now, provide an overall synthesis of this spread. How do these cards interact? What is the final message for the user?`

    spindle.sendToFrontend({ type: 'stream_start', cardIndex: 'synthesis' }, userId)

    try {
      const stream = spindle.generate.rawStream({
        connection_id: settings.connectionId,
        model: connection.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        parameters: { temperature: 0.7 },
        userId: userId
      } as any)

      let fullText = ''
      for await (const chunk of stream) {
        if (chunk.type === 'token') {
          fullText += chunk.token
          spindle.sendToFrontend({ type: 'stream_token', cardIndex: 'synthesis', token: chunk.token }, userId)
        } else if (chunk.type === 'done') {
          fullText = chunk.content || fullText
        }
      }
      spindle.sendToFrontend({ type: 'stream_end', cardIndex: 'synthesis', fullText }, userId)

      // Save to history
      const activeChat = await spindle.chats.getActive(userId)
      const chatId = activeChat?.id || 'global'
      const history = await spindle.userStorage.getJson<any[]>(`history/${chatId}.json`, { fallback: [], userId })
      
      history.unshift({
        timestamp: Date.now(),
        question: reading.question,
        spreadType: reading.spreadType,
        variant: reading.variant,
        cards: reading.cards.map((c: any, i: number) => ({ 
          id: c.id, 
          inverted: c.inverted, 
          name: TAROT_DECK.find(t => t.id === c.id)?.name,
          interpretation: reading.interpretations[i] 
        })),
        synthesis: fullText
      })
      
      // Keep only the last 3 readings
      history.splice(3)
      await spindle.userStorage.setJson(`history/${chatId}.json`, history, { userId })

    } catch (err: any) {
      spindle.log.error(`Synthesis failed: ${err.message}`)
      spindle.sendToFrontend({ type: 'stream_end', cardIndex: 'synthesis', fullText: `Error: ${err.message}` }, userId)
    }
  }

  if (payload.type === 'load_history') {
    const activeChat = await spindle.chats.getActive(userId)
    const chatId = activeChat?.id || 'global'
    const history = await spindle.userStorage.getJson<any[]>(`history/${chatId}.json`, { fallback: [], userId })
    spindle.sendToFrontend({ type: 'history_data', history }, userId)
  }

  if (payload.type === 'clear_history_current') {
    const activeChat = await spindle.chats.getActive(userId)
    const chatId = activeChat?.id || 'global'
    try {
      await spindle.userStorage.delete(`history/${chatId}.json`, userId)
      spindle.toast.success('Cleared history for this chat.')
    } catch (err) {
      // Ignore error if file doesn't exist
    }
  }

  if (payload.type === 'clear_history_all') {
    try {
      const files = await spindle.userStorage.list('history/', userId)
      for (const file of files) {
        await spindle.userStorage.delete(file, userId)
      }
      spindle.toast.success('Cleared all reading history.')
    } catch (err) {
      spindle.toast.error('Failed to clear all history.')
    }
  }
})

spindle.log.info('Tarot Reader backend loaded.')
