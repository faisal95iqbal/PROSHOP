import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

//@desc fetch all products
//@route /api/products
//@access public
export const getProducts = asyncHandler( async ( req, res ) => {
    const pageSize = 5
    const page =Number(req.query.pageNumber) || 1
    const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' } } : {}
    const count = await Product.countDocuments({...keyword})
    const products = await Product.find( { ...keyword } ).limit( pageSize ).skip( pageSize * ( page - 1 ) )
    res.json( { products,page,pages:Math.ceil(count/pageSize) } )
} )

//@desc get top products
//@route GET /api/products/top
//@access public
export const getTopProducts = asyncHandler( async ( req, res ) => {
    const products = await Product.find( {} ).sort({rating:-1}).limit(3)
    res.json( products )
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

//@desc create a product review
//@route PPST /api/products/:id/reviews
//@access private
export const createProductReview = asyncHandler( async ( req, res ) => {
    const { rating,comment } = req.body

    const product = await Product.findById( req.params.id )
    if ( product ) {
        const alreadyReview = product.reviews.find( r => r.user.toString()=== req.user._id.toString())
        if ( alreadyReview ) {
            res.status( 400 )
            throw new Error('Product Already Reviewed')
        }
        const review = {
            name: req.user.name,
            rating: Number( rating ),
            comment,
            user:req.user._id
        }
        product.reviews.push( review )
        product.numReviews = product.reviews.length
        product.rating = product.reviews.reduce( ( acc, item ) => item.rating + acc, 0 ) / product.reviews.length
        await product.save()
        res.status(201).json({message:'review added'})
    } else {
        res.status( 404 )
        throw new Error('Product not found')
    }
    
} )