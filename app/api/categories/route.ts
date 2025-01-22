import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";


const GET = async () => {
    try {
        const response = await prisma.tags.findMany({
            include: {
                parentTag:true
            }
        })
        return new NextResponse(JSON.stringify({message:response, status:200}))
    } catch (error) {
        return new NextResponse(JSON.stringify({message:error, status:500}))
    }
}


const POST = async (req: NextRequest) => {
    try {
        const { title, description, parentId } = await req.json()
        if (!title || !description) {
            return NextResponse.json({message:"Title and description are required!"},{status:400})
        }

        // check is name is used
        const category = await prisma.tags.findUnique({
            where: {
                name:title
            }
        })

        if (category) {
            return NextResponse.json({message:`a category with name ${title} already exist`},{status:401})
        }

        const newCategory = await prisma.tags.create({
            data: {
                name:title,
                description,
                parentId,
                isOnDisplay: true,
            }
        })

        return NextResponse.json({message:"Created Category!",newCategory},{status:200})
    } catch (error) {
        return NextResponse.json({message:"Failed to create category",error},{status:500})
    }
}



const DELETE = async (req:NextRequest) => {
    try {
        // get target category id
        const { searchParams } = new URL(req.url)
        const categoryId = searchParams.get("categoryId")

        // check if id is supplied
        if (!categoryId) return NextResponse.json({ message: "categoryId required" }, { status: 400 })
        
        // check if category exist before delete
        const forDeleteCategory = await prisma.tags.findUnique({
            where:{id:categoryId}
        })

        // check if the category is a parent
        const childForCategory = await prisma.tags.findFirst({
            where: {
                parentId:categoryId
            }
        })

        //* refuse action
        if(childForCategory) return NextResponse.json({
            message: `Unable to delete this category because it is a parent of other categories, such as ${childForCategory.name}.`,
          }, { status: 403 });

        if (!forDeleteCategory) return NextResponse.json({ message: `no category with id ${categoryId} found` }, { status: 404 })
        
        // delete the category
        await prisma.tags.delete({
            where: {
                id:categoryId
            }
        })

        return NextResponse.json({ message: `Category deleted!`,categoryName:forDeleteCategory.name }, { status: 200 })

    } catch (error:any) {
        return NextResponse.json({ message: `Failed to delete Category from db`, error }, { status: 500 })
    }
}

const PUT = async (req: NextRequest) => {
    try {        
        const { searchParams } = new URL(req.url)
        const categoryId = searchParams.get("categoryId")

        if (categoryId) {
            const targetCategory = await prisma.tags.findUnique({
                where:{id:categoryId}
            })
            if (!targetCategory) return NextResponse.json({ message: "Couldn't find category to edit" }, { status: 404 })
            
            await prisma.tags.update({
                where: { id: categoryId },
                data: {
                    isOnDisplay: !targetCategory.isOnDisplay
                }
            })

            return NextResponse.json({ message: "Category updated!" }, { status: 200 })
        }

        const { name, description, parentId, categoryIdForEdit } = await req.json()
        // check the required felids
        if (!name || !description) return NextResponse.json({ message: "Title and Description are required for the category" }, { status: 400 })
        
        // check if category exist
        const targetCategory = await prisma.tags.findUnique({
            where: {
                id:categoryIdForEdit
            }
        })
    // no category found with that id
        if (!targetCategory) return NextResponse.json({ message: "No Category found to update" }, { status: 404 })
        
        // update the category
        const updatedCategory = await prisma.tags.update({
            where: { id: categoryIdForEdit },
            data: {
                name: name,
                description: description,
                parentId:parentId
            },
            include: {
                parentTag:true
            }
        })

        return NextResponse.json({message:"Category updated successfully",updatedCategory},{status:200})
    } catch (error) {
        return NextResponse.json({message:"Failed to update category",error},{status:500})
    }
}


export {GET,POST,DELETE,PUT}