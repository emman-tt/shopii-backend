import { ProductModel } from '../database/products.js'

export async function Uploader (req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image added' })
    }

    const { name, price, description, catID, GenId, highlights } = req.body
    console.log(name, price, description)
    // console.log('Uploaded file:', JSON.stringify(req.file, null, 2))
    const imageUrl = req.file.path

    const parsedHighlights = JSON.parse(highlights)
    ;(async function saveProduct () {
      try {
     const product =   await ProductModel.create({
          name: name,
          price: price,
          description: description,
          image: imageUrl,
          categoryId: catID,
          genderId: GenId,
          highlights: parsedHighlights
        })

        if (product) {
          console.log(product.toJSON())
        }
      } catch (error) {
        console.log(error.message)
      }
    })()

    res.json({
      success: true,
      message: 'Saved successfully',
      url: imageUrl
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Upload failed', error: error.message })
  }
}


