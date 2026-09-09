declare const spindle: import('lumiverse-spindle-types').SpindleAPI

// In-memory cache for asset URLs
let cachedImageUrls: Record<number, string> = {}

async function ensureAssetsSeeded(userId: string) {
  spindle.log.info('lumi-tarot: Checking assets...')
  
  // Check if we already have URLs cached in extension storage
  const storedUrls = await spindle.storage.getJson<Record<number, string> | null>('image_urls.json', { fallback: null })
  if (storedUrls && Object.keys(storedUrls).length === 79) {
    cachedImageUrls = storedUrls
    spindle.log.info(`lumi-tarot: Loaded ${Object.keys(cachedImageUrls).length} cached image URLs.`)
    return
  }

  spindle.log.info('lumi-tarot: Seeding 79 tarot images to Lumiverse asset system...')
  const uploadItems = []
  
  for (let i = 0; i <= 78; i++) {
    const filename = `${i.toString().padStart(2, '0')}.jpg`
    try {
      const data = await spindle.storage.readBinary(`assets/${filename}`)
      uploadItems.push({
        data,
        filename: filename,
        mime_type: 'image/jpeg'
      })
    } catch (err) {
      spindle.log.error(`Failed to read ${filename}. Ensure your images are in the assets/ folder.`)
    }
  }

  if (uploadItems.length !== 79) {
    spindle.log.error(`Expected 79 images, found ${uploadItems.length}. Aborting seed.`)
    return
  }

  // Pass userId to uploadMany so it knows who owns the images
  const results = await spindle.images.uploadMany(uploadItems, { userId })
  
  const newUrls: Record<number, string> = {}
  results.forEach((result, index) => {
    const id = uploadItems[index].filename.split('.')[0]
    if (result.id) {
      // We'll use 'lg' for a good balance of quality/performance
      newUrls[Number(id)] = `/api/v1/images/${result.id}?size=lg`
    } else {
      spindle.log.error(`Failed to upload image ${id}: ${result.error}`)
    }
  })

  cachedImageUrls = newUrls
  await spindle.storage.setJson('image_urls.json', newUrls)
  spindle.log.info('lumi-tarot: Successfully seeded and cached all images.')
}

// Basic init handler so the frontend can request data once built
spindle.onFrontendMessage(async (payload: any, userId) => {
  if (payload.type === 'init') {
    // Ensure assets are ready before responding, now that we have the userId
    if (Object.keys(cachedImageUrls).length === 0) {
      await ensureAssetsSeeded(userId)
    }

    // Fetch user-specific data
    const connections = await spindle.connections.list(userId)
    const activeChat = await spindle.chats.getActive(userId)
    
    const { data } = await spindle.characters.list({ limit: 200 }, userId)
    const characters = data

    const settings = await spindle.storage.getJson('settings.json', {
      fallback: {
        systemPrompt: "You are an expert tarot reader. Interpret the cards based on traditional meanings while considering the user's context and question. Keep the tone mystical yet clear.",
        connectionId: connections.find(c => c.is_default)?.id || ""
      }
    })

    spindle.sendToFrontend({
      type: 'init_data',
      imageUrls: cachedImageUrls,
      connections,
      characters,
      activeChatId: activeChat?.id || null,
      settings
    }, userId)
  }

    // Add this inside spindle.onFrontendMessage, after the 'init' block
  if (payload.type === 'save_settings') {
    await spindle.storage.setJson('settings.json', {
      systemPrompt: payload.systemPrompt,
      connectionId: payload.connectionId
    })
    spindle.toast.success('Tarot settings saved!')
   }
})

spindle.log.info('lumi-tarot backend loaded.')
