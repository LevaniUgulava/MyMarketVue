<template>
  <div class="comment-modal">
    <div class="modal-content">
      <button class="close-btn" @click="closeModal">Close</button>
      <h2>{{ product.name }}'s Comments</h2>
      <div class="comments-container">
        <ul>
          <li v-for="comment in comments" :key="comment.pivot.created_at" class="comment-item">
            <strong>{{ comment.name }}</strong>
            <p>{{ comment.pivot.comment }}</p>
          </li>
        </ul>
      </div>
      <form v-if="checkuser()" @submit.prevent="submitComment(product.id)" class="comment-form">
        <input v-model="newComment" name="comment" type="text" placeholder="Add a comment" />
        <button type="submit">Comment</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'CommentModal',
  props: {
    product: {
      type: Object,
      required: true
    },
    comments: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      newComment: ''
    };
  },
  methods: {
    checkuser(){
      const token=localStorage.getItem('token');
      if(token){
        return true;
      }
      return false;
    },
    
    closeModal() {
      this.$emit('close');
    },
    async submitComment(id) {
      const token = localStorage.getItem('token');
      try {
        await axios.post(`http://127.0.0.1:8000/api/products/${id}/comment`, { comment: this.newComment }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.newComment = '';
        this.$emit('comment-submitted', id); 
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    }
  },
};
</script>

<style scoped>
.comment-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  width: 80%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 20px;
  color: #555;
}

h2 {
  margin-top: 0;
  text-align: center;
  color: #333;
}

.comments-container {
  max-height: 300px;
  overflow-y: auto;
  margin-top: 20px;
  border: 1px solid #eee;
  padding: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.comment-item {
  margin-bottom: 15px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.comment-item strong {
  display: block;
  font-weight: bold;
  color: #555;
  margin-bottom: 5px;
}

.comment-item p {
  margin: 0;
  color: #666;
}

.comment-form {
  display: flex;
  margin-top: 20px;
}

.comment-form input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
  font-size: 14px;
}

.comment-form button {
  padding: 10px 20px;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 14px;
  cursor: pointer;
}

.comment-form button:hover {
  background-color: #0056b3;
}
</style>
