const  pool  = require('../db');

const createPost = async (req, res) => {
    try{
        const {content, threadId} = req.body;
        const userId = req.user.id;

        if(!content || !threadId){
            return res.status(400).json({message: 'Missing fields'});
        }

        await pool.query(`INSERT INTO posts (content, thread_id, user_id) VALUES ($1, $2, $3)`, [content, threadId, userId]);
        return res.status(201).json({message: 'Post created successfully'});
    }catch(error){
        console.error('Error creating post; ', error);
        return res.status(500).json({message: 'Server error'});
    }
}

module.exports = createPost;