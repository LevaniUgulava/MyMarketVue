<template>
    <div class="exclusive-collection-banner" @click="handleClick" v-if="isEnded">
        <div class="background-animation"></div>
        <div class="collection-content">
            <div class="badge">{{ status.name }} Status</div>
            <h3 class="title">Exclusive Discount Based on Your Status</h3>
            <p class="description">
                <CountDownComponent 
                :startTime="startTime"
                :endTime="endTime"
                @isEnded="handleend"
                />
            </p>
        </div>
    </div>
</template>


<script>
import axios from 'axios';
import CountDownComponent from '../CountDownComponent.vue';
export default {
    name:"ExclusiveCollection",
    components:{
        CountDownComponent,
    },
    data() {
        return {
            status:"",
            products:[],
            isEnded:''
            
        }
    },
    computed: {
  startTime() {
    return this.status ? new Date(this.status.start_data.replace(" ", "T")) : null;
  },
  endTime() {
    return this.status ? new Date(this.status.end_date.replace(" ", "T")) : null;
  },
},

    methods:{
        handleend(isEnded){
           this.isEnded=isEnded
        },
        async getexclusive(){
            const token = localStorage.getItem('token');
            try{
                  const response = await axios.get("/current/status",{
                headers:{
                 "Authorization": `Bearer ${token}`
                }
            });
            this.status=response.data.status;

            }catch(error){
                console.log(error);
            }
        
        },
           handleClick() {
            this.$router.push({
            name: "ExclusivePage",
               });
           },
    },
    mounted() {
        this.getexclusive();
    },
    

};
</script>

<style scoped>
.exclusive-collection-banner {
    background: linear-gradient(180deg, Gold, #ff8c00);
    border-radius: 20px;
    padding: 30px;
    /* max-width: 900px; */
    height: 200px;
    margin: 20px auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    text-align: center;
    color: #fff;
    font-family: 'Arial', sans-serif;
    transition: transform 0.3s ease-in-out;
}

.exclusive-collection-banner:hover {
    transform: scale(1.01);
}

.badge {
    background: #064545;
    font-size: 14px;
    font-weight: bold;
    padding: 8px 15px;
    border-radius: 12px;
    display: inline-block;
    margin-bottom: 15px;
}

.title {
    font-size: 30px;
    font-weight: bold;
    margin: 5px 0;
    letter-spacing: 2px;
}

.description {
    font-size: 18px;
    margin: 15px 0;
}

.description .highlight {
    color: #fff;
    font-size: 22px;
    font-weight: bold;
}



</style>
