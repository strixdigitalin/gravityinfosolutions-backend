const Blog = require("../models/Blog");
const { removeUndefined, uploadToCloudinary } = require("../util/util");
const cloudinary = require("cloudinary").v2;

const getBlogs=async ({id, slug})=>{
    let and = [];
    if(id)
    {
        and.push({_id: id});
    }
    if(slug)
    {
        and.push({slug});
    }
    if(and.length===0)
    {
        and.push({});
    }
    const data=await Blog.find({$and: and});
    return {status: true,  data};
};

const postBlog=async ({title, subTitle, writtenBy, tags, file, desc, slug, auth})=>{
    // if(!auth || auth.role!=='ADMIN')
    // {
    //     return { status: false, message: "Not Authorised" };
    // }

    // console.log(title, subTitle, writtenBy, tags, file);

    var locaFilePath = file.path;
    var result = await uploadToCloudinary(locaFilePath);
    console.log(result);
    // res.json({ url: result.url, public_id: result.public_id,msg:"Image Upload Successfully" });

    const newBlog = new Blog({
        title, subTitle, writtenBy, tags, slug, img: {
            url: result.url,
            id: result.public_id
        }, desc, ts: new Date().getTime()
    });
    const saveBlog = await newBlog.save();

    return { status: true, message: 'New blog created', data: saveBlog };
};

const updateBlog = async ({ id, auth, title, subTitle, writtenBy, tags, desc, slug, file }) => {
    // if (!auth  || auth.role!=='ADMIN') {
    //     return { status: false, message: "Not Authorised" }
    // }

    let updateObj = removeUndefined({ title, subTitle, writtenBy, tags, desc, slug });

    if (file !== '' && file !== undefined) {
        // insert new image as old one is deleted
        var locaFilePath = file.path;
        var result = await uploadToCloudinary(locaFilePath);
        updateObj['img'] = {
            url: result.url,
            id: result.public_id
        };
    }

    const updateBlog = await Blog.findByIdAndUpdate(id, { $set: updateObj }, { new: true });

    return { status: true, message: 'Blog updated successfully', data: updateBlog };
};

const deleteBlogImage = async ({ auth, id }) => {
    // if (!auth || auth.role!=='ADMIN') {
    //     return { status: false, message: "Not Authorised" };
    // }
    id = id.replaceAll(':', '/');
    console.log(id);

    cloudinary.uploader.destroy(id, async (err, result) => {
        console.log(result);
        if (err) throw err;
    });

    return { status: true, message: 'Blog image deleted successfully' };
};

const deleteBlog = async ({ auth, id }) => {
    // if (!auth || auth.role!=='ADMIN') {
    //     return { status: false, message: "Not Authorised" };
    // }

    const deleteBlog = await Blog.findByIdAndDelete(id);
    if (deleteBlog.img.url) {
        cloudinary.uploader.destroy(deleteBlog.img.id, async (err, result) => {
            console.log(result);
            if (err) throw err;
        });
    }
    // console.log(deleteBlog);

    return { status: true, message: 'Blog deleted successfully' };
};

const deleteAllBlogs = async ({ auth }) => {
    // if (!auth) {
    //     return { status: false, message: "Not Authorised" }
    // }
    const deleteBlog = await Blog.deleteMany();

    return { status: true, message: 'All Blogs deleted successfully' };
};

module.exports={
    getBlogs,
    postBlog,
    updateBlog,
    deleteAllBlogs,
    deleteBlog,
    deleteBlogImage
};
