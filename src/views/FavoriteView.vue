
  <template>
    <div class="main-content">
      <Message v-if="emitdata" closable class="message">{{ emitdata }}</Message>
      <Message v-if="emitlikemessage" closable class="message" severity="error">{{ emitlikemessage }}</Message>
      <Message v-if="emitcartmessage" closable class="message" severity="error">{{ emitcartmessage }}</Message>


        <div v-if="products.length>0">
      <div class="products-wrapper">
        <ProductCardComponent
          v-for="(item) in products"
          :key="item.id"
          :initialproduct="item"
          @show-comments="showCommentsModal(item.id)"
          @cart-updated="handleCartUpdated"
          @liked-message="handleunauthorizedlike"
          @cart-message="handleunauthorizedcart"
        />
      </div>
        </div>
    <div v-else class="no-products-message">
  <p>Don't have liked products</p>
</div>
      


      <Bootstrap5Pagination :data="pagination" @pagination-change-page="changePage" />
    </div>

    <CommentModal
      v-if="showModal"
      :product="selectedProduct"
      :comments="selectedProductComments"
      @close="closeModal"
      @comment-submitted="refreshComments(selectedProduct.id)"
    />
</template>

<script>
import ProductCardComponent from '../components/ProductCardComponent.vue';
import CommentModal from '../components/CommentModal.vue';
import Message from 'primevue/message';
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import axios from 'axios';

export default {
  name: 'FavoriteView',
  components: {
    ProductCardComponent,
    CommentModal,
    Message,
    Bootstrap5Pagination,
  },
  data() {
    return {
      products: [],
      showModal: false,
      selectedProduct: null,
      selectedProductComments: [],
      searchname: '',
      maincategories: [],
      selectedmainCategory: null,
      selectedCategory: null,
      emitdata: null,
      emitlikemessage: null,
      emitcartmessage: null,
      pagination: {},
    };
  },
  watch: {
    emitdata(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.emitdata = null;
        }, 3000);
      }
    },
    emitlikemessage(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.emitlikemessage = null;
        }, 3000);
      }
    },
    emitcartmessage(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.emitcartmessage = null;
        }, 3000);
      }
    },
    '$route.query': {
      handler: 'fetchfavorite',
      immediate: true,
    },
  },
  methods: {
   async fetchfavorite(){
      const token=localStorage.getItem('token');
        try{
        const response= await axios.get('http://127.0.0.1:8000/api/likeproduct',{
            headers: {
                'Authorization': `Bearer ${token}`
            }     
            });
            this.products=response.data.data;
            console.log(this.products);

        }catch(error){
            console.log(error)
        }
    },
      async showCommentsModal(id) {
      try {
        const { data } = await axios.get(`http://127.0.0.1:8000/api/products/${id}/display`);
        this.selectedProductComments = data;
        this.selectedProduct = this.products.find((product) => product.id === id);
        this.showModal = true;
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },
   
    
    async refreshComments(productId) {
      try {
        const { data } = await axios.get(`http://127.0.0.1:8000/api/products/${productId}/display`);
        this.selectedProductComments = data;
      } catch (error) {
        console.error('Error refreshing comments:', error);
      }
    },

    closeModal() {
      this.showModal = false;
      this.selectedProduct = null;
      this.selectedProductComments = [];
    },
  
    handleCartUpdated(cartData) {
      this.emitdata = cartData.message;
    },
    handleunauthorizedlike(likedmessage) {
      this.emitlikemessage = likedmessage;
    },
    handleunauthorizedcart(cartmessage) {
      this.emitcartmessage = cartmessage;
    },
    changePage(page) {
      this.$router.push({ path: '/', query: { ...this.$route.query, page } });
    },

  },
    

  mounted() {
    this.fetchfavorite();
  },
};
</script>
<style >
.products-wrapper {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5 equal-width columns */
  width: 100%;
}

.message {
  position: sticky;
  top: 70px;
  z-index: 999;
  width: 100%;
}
.pagination {
  display: flex;
  list-style-type: none;
  padding: 0;
  justify-content: center;
  margin: 20px 0;
}

/* Pagination Items */
.page-item {
  margin: 0 5px;
}

/* Pagination Links */
.page-link {
  display: block;
  padding: 10px 15px;
  color: #007bff;
  text-decoration: none;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

/* Active Pagination Link */
.page-item.active .page-link {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

/* Hover and Focus States */
.page-link:hover, .page-link:focus {
  background-color: #0056b3;
  color: white;
  border-color: #0056b3;
  text-decoration: none;
}

/* Disabled State */
.page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  background-color: #fff;
  border-color: #dee2e6;
}

/* Additional styling for a more solid look */
.page-link {
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.page-link:active {
  background-color: #004085;
  border-color: #004085;
  color: white;
}

@media (max-width:490px){
  .products-wrapper{
      grid-template-columns: repeat(2, 1fr); /* 5 equal-width columns */
      margin-top: 20px;
  }
}

</style>