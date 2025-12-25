import { ProductModel } from '../database/products.js'

export async function Uploader (req, res) {
  try {
    console.log('Request received')
    console.log(req.body)

    // 1. Check for file
    if (!req.file) {
      return res.status(400).json({ error: 'No image added' })
    }

    const { name, price, description, catID, GenID, highlights, colours } =
      req.body

    // 2. Validate fields (Fixes the hanging issue)
    if (
      !name ||
      !price ||
      !description ||
      !catID ||
      !GenID ||
      !highlights ||
      !colours
    ) {
      console.log('Validation failed: Missing fields')
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const imageUrl = req.file.path
    const parsedHighlights = JSON.parse(highlights)
    const parsedColours = JSON.parse(colours)
    // console.log(parsedColours)

    // 3. Save to DB (Wait for this to finish before responding)
    const product = await ProductModel.create({
      name: name,
      price: price,
      description: description,
      image: imageUrl,
      categoryId: catID,
      genderId: GenID,
      highlights: parsedHighlights,
      colours: parsedColours
    })

    // 4. Send the success response AFTER the save is successful
    return res.status(201).json({
      success: true,
      message: 'Saved successfully',
      url: imageUrl,
      product: product
    })
  } catch (error) {
    console.error('Upload Error:', error)
    // Ensure we send a response on error so it doesn't spin
    return res.status(500).json({
      message: 'Upload failed',
      error: error.message
    })
  }
}
