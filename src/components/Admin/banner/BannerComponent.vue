<template>
    <div class="banner-container">
        <div class="button">
            <button class="action" @click.prevent="redirect">დამატება</button>
        </div>
        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>ბანერი</th>
                        <th>მისამართი</th>
                        <th>მოქმედებები</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in banners" :key="index">
                        <td>
                            <img :src="item.media_url" alt="banner" class="img">
                        </td>
                        <td>{{ item.url }}</td>
                        <td>
                            <div class="action-buttons">
                                <i @click.prevent="deletebanner(item.id)" class="fa-solid fa-trash delete"></i>

                                <div v-if="item.active">
                                    <i @click.prevent="notactive(item.id)" class="fa-regular fa-eye notactive"></i>
                                </div>
                                <div v-else>
                                    <i @click.prevent="active(item.id)" class="fa-regular fa-eye-slash active"></i>
                                </div>
                            </div>

                        </td>
                    </tr>

                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import api from '@/api';

export default {
    data() {
        return {
            banners: [],
        }
    },
    methods: {
        redirect() {
            this.$router.push('/banner/create');
        },
        async getbanner() {
            try {
                const response = await api.get('banner/admin/display', {
                    tokenRequired: true
                });
                this.banners = response.data;

            } catch (error) {
                console.log(error)
            }
        },
        async deletebanner(id) {
            try {
                await api.delete(`banner/admin/delete/${id}`, {
                    tokenRequired: true
                });
                this.getbanner();

            } catch (error) {
                console.log(error)
            }
        },
        async notactive(id) {
            try {
                await api.patch(`/banner/admin/${id}/notactive`, {}, {
                    tokenRequired: true
                });
                this.getbanner();

            } catch (error) {
                console.log(error);
            }

        },
        async active(id) {
            try {
                await api.patch(`/banner/admin/${id}/active`, {}, {
                    tokenRequired: true
                });
                this.getbanner();

            } catch (error) {
                console.log(error);
            }
        },
    },
    mounted() {
        this.getbanner();
    },

}
</script>
<style scoped>
.action {
    display: flex;
    padding: 10px 15px;
    background-color: white;
    border: 1px solid #ccc;
    color: #757272;
    border-radius: 5px;
    cursor: pointer;
}

.table-container {
    display: flex;
    margin-top: 20px;
    justify-content: center;
}

.table {
    border: 1px solid #ccc;
    width: 100%;
    border-collapse: collapse;
}

.table th,
.table td {
    padding: 10px;
    text-align: center;
    border: 1px solid #ddd;
}

.table th {
    background-color: #f4f4f4;
}

.img {
    width: 100px;
}

i {
    padding: 10px 15px;
    border-radius: 10px;

}

.delete {
    background-color: rgb(255, 0, 0);
    color: white;
}

.delete:hover {
    background-color: rgb(173, 5, 5);
}


.notactive {
    background-color: #4CAF50;
    color: white;
}

.notactive:hover {
    background-color: #45a049;
}

.active {
    background-color: #FFC107;
    color: white;
}

.active:hover {
    background-color: #e0a800;

}

.action-buttons {
    display: flex;
    justify-content: center;
    gap: 15px;
}



.table td {
    background-color: #fafafa;
}
</style>