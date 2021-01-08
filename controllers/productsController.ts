import { Client } from "https://deno.land/x/postgres/mod.ts";
import { Product } from "./../models/productModel.ts";
import { dbConn } from "../config.ts"


//Init Client
const client = new Client(dbConn)


//  @desc   Get all products
//  @route  GET /api/v1/products

export const getProducts = async ({response}:{response:any}) => {
    try {
        await client.connect()
        const result= await client.query("SELECT * FROM products")

        const products = new Array()

        result.rows.map(p=>{
            let ob :any = new Object()
            result.rowDescription.columns.map((c,i)=>{
                ob[c.name]=p[i]
            })
            products.push(ob)
        })

        response.status= 200
        response.body = {
            success : true,
            data: products
        }

    } 
    catch (error) {
        response.status= 500
        response.body = {
            success : true,
            msg: error.toString() 
        }
    }
    finally {
        await client.end()
    }
}

//  @desc   Get single product
//  @route  GET /api/v1/products/:id

export const getProduct = async ({response,params}:{response:any, params: {id:string} }) => { 
    try {
        await client.connect()
        const result = await client.query("SELECT * FROM products WHERE id=$1",params.id)
        if(result.rows.toString() === ""){
            response.status=404
            response.body = {
                success:false,
                msg: `No product whit the id ${params.id}`
            }
        } else {
            const product : any = new Object()
            result.rows.map( p =>{
                result.rowDescription.columns.map((c,i)=>{
                    product[c.name]=p[i]
                }) 
            })
            response.status=200
            response.body = {
                success: true,
                data: product
            }
        }

    } catch (error) {
        response.status= 500
        response.body = {
            success : true,
            msg: error.toString() 
        }
    }
    finally {
        await client.end()
    }
}

//  @desc   Add new product
//  @route  POST /api/v1/products

export const addProduct = async ({ request, response }: { request: any, response: any }) => {    
    const body = await request.body();
    console.log(body.value)
    if (!request.hasBody) {
        response.status = 400;
        response.body = {
            success: false,
            message: 'No data',
        };
    } else {
        try {
            await client.connect()
            const product = await body.value;
            const result = await client.query("INSERT INTO products(name,description,price) VALUES($1,$2,$3)", 
            product.name, 
            product.description, 
            product.price);

            response.status = 201;
            response.body = {
                success: true,
                message: 'Product added successfully',
                data: product
            };
        } catch (err) {
            response.status = 500
            response.body = {
                success: false,
                msg: err.toString()
            }
        } finally {
            await client.end()
        }
    }
}

//  @desc   update a product
//  @route  PUT /api/v1/products/:id

export const updateProduct = async ({response, request, params }:{response:any, request:any, params:{id:string} }) => {
    await getProduct({response, params : { "id" : params.id } })
    if(response.status===404){
        response.status=404
        response.body={
            success:false,
            msg:response.body.msg
        }
        return
    } else {
        const body=await request.body();
        if (!request.hasBody) {
            response.status = 400;
            response.body = {
                success: false,
                message: 'No data',
            };
        } else {
            try {
                await client.connect()
                const product = await body.value;
                const result = await client.query("UPDATE  products SET name=$1,description=$2,price=$3 WHERE id=$4", 
                product.name, 
                product.description, 
                product.price,
                params.id);
    
                response.status = 200;
                response.body = {
                    success: true,
                    message: 'Product updated successfully',
                    data: product
                };
            } catch (err) {
                response.status = 500
                response.body = {
                    success: false,
                    msg: err.toString()
                }
            } finally {
                await client.end()
            }
        }
    }
}

//  @desc   Delete a product
//  @route  DELETE /api/v1/products/:id

export const deleteProduct = async ({response,params}:{response:any, params: {id:string} }) => {
    await getProduct({response, params : { "id" : params.id } })
    if(response.status===404){
        response.status=404
        response.body={
            success:false,
            msg:response.body.msg
        }
        return
    } else {
        try {
            await client.connect()
            const result = await client.query("DELETE FROM products WHERE id=$1",params.id)

            response.status = 204;
                response.body = {
                    success: true,
                    message: 'Product deleted successfully'
                };
            } 
            catch (err) {
                response.status = 500
                response.body = {
                    success: false,
                    msg: err.toString()
                }
            } 
            finally {
                await client.end()
            }
    }
}