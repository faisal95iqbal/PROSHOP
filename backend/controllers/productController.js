import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

//@desc fetch all products
//@route /api/products
//@access public
export const getProducts = asyncHandler( async ( req, res ) => {
    const products = await Product.find( {} )
    res.json(products)
} )

//@desc fetch product searched by id
//@route /api/products/:id
//@access public
export const getProductById = asyncHandler( async ( req, res ) => {
     const product = await Product.findById( req.params.id )
    if ( product ) {
        res.json(product)
    } else {
        res.status( 404 )
        throw new Error('product not found')
    }
} )

//@desc delete a product
//@route DELETE /api/products/:id
//@access public admin
export const deleteProduct = asyncHandler( async ( req, res ) => {
     const product = await Product.findById( req.params.id )
    if ( product ) {
        await product.remove()
        res.json({message:'Product Removed'})
    } else {
        res.status( 404 )
        throw new Error('product not found')
    }
} )

//@desc create a product
//@route POST /api/products
//@access public admin
export const createProduct = asyncHandler( async ( req, res ) => {
    const product = new Product( {
        name: 'sample name',
        price: 0,
        image: '/images/sample.jpg',
        brand: 'sample brand',
        category: 'sample category',
        countInStock: 0,
        numReviews: 0,
        description:'sample description'
    } )
    
    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
} )

//@desc update a product
//@route PUT /api/products/:id
//@access public admin
export const updateProduct = asyncHandler( async ( req, res ) => {
    const { name, price, image, brand, category, countInStock, description } = req.body

    const product = await Product.findById( req.params.id )
    if ( product ) {
        product.name = name
        product.price = price
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock
        product.description = description
        
        const updatedProduct = await product.save()
        res.json(updatedProduct)
    } else {
        res.status( 404 )
        throw new Error('Product not found')
    }
    
} )
