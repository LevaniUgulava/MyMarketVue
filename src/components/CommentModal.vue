<template>
  <div class="comment-modal">
    <div class="modal-content">
      <button class="close-btn" @click="closeModal">✕</button>
      <h2>{{ product.name }}'s Comments</h2>

      <div class="comments-container">
        <ul v-if="comments.length > 0">
          <li v-for="comment in comments" :key="comment.pivot.created_at" class="comment-item">
            <div class="comment-header">
              <strong>{{ comment.name }}</strong>
              <span class="comment-time">{{ new Date(comment.pivot.created_at).toLocaleString() }}</span>
            </div>
            <p>{{ comment.pivot.comment }}</p>
          </li>
        </ul>
        <p v-else class="no-comments-message">No comments yet. Be the first to comment!</p>
      </div>

      <form v-if="checkuser()" @submit.prevent="submitComment(product.id)" class="comment-form">
        <input v-model="newComment" name="comment" type="text" placeholder="Add your comment..." />
        <button type="submit">Post Comment</button>
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
    checkuser() {
      const token = localStorage.getItem('token');
      return !!token;
    },
    closeModal() {
      this.$emit('close');
    },
    async submitComment(id) {
      const token = localStorage.getItem('token');
      try {
        await axios.post(`products/${id}/comment`, { comment: this.newComment }, {
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
  inset: 0;
  background-color: rgb(71 68 68 / 19%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(1px);
}

.modal-content {
  position: relative;
  background-color: #fff;
  padding: 24px;
  border-radius: 10px;
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.15);
  max-width: 600px;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: transform 0.3s ease;
}

.modal-content {
  background-color: #fff;
  padding: 25px;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  position: relative;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.4s ease-in-out;
  text-align: left;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 1.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #999;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #333;
}

h2 {
  text-align: center;
  color: #333;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
}

.comments-container {
  max-height: 300px;
  overflow-y: auto;
  padding: 12px;
  border-radius: 8px;
  background-color: #f8f8f8;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.no-comments-message {
  color: #888;
  font-size: 1rem;
  text-align: center;
  margin: 0;
  font-style: italic;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.comment-item {
  margin-bottom: 15px;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  color: #555;
  margin-bottom: 4px;
}

.comment-time {
  font-size: 0.85rem;
  color: #888;
}

.comment-item p {
  margin: 0;
  color: #444;
  line-height: 1.5;
}

.comment-form {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  align-items: center;
}

.comment-form input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 0.95rem;
  color: #333;
  transition: border-color 0.3s ease;
}

.comment-form input:focus {
  border-color: #007bff;
  outline: none;
}

.comment-form button {
  padding: 10px 20px;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.comment-form button:hover {
  background-color: #0056b3;
  transform: translateY(-1px);
}
</style>
