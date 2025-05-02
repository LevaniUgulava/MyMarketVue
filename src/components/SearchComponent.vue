<template>

    <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    </head>
    <div class="search">
        <div class="search-container">
            <input @keyup.enter="performSearch" type="text" class="searchname" v-model="searchname"
                placeholder="ძიება..." />
        </div>
    </div>

    <div v-if="searchname == '' && HistoryNames.length > 0 && isAuthenticated" class="suggestions-container">
        <h6><span class="title">ბოლოს მოძიებული</span></h6>
        <div v-for="(item, index) in HistoryNames" :key="index" class="suggestion-item"
            @click="selectSuggestion(item.term)">
            <i class="fas fa-clock-rotate-left "></i> {{ item.term }}
            <i class="fa-solid fa-xmark remove"></i>

        </div>
    </div>

    <div v-if="searchname == '' && popularNames.length > 0" class="suggestions-container">
        <h6><span class="title">პოპულარული</span></h6>
        <div v-for="(item, index) in popularNames" :key="index" class="suggestion-item"
            @click="selectSuggestion(item.term)">
            <i class="fa-solid fa-magnifying-glass"></i> {{ item.term }}
        </div>
    </div>

    <div v-if="SuggestionNames.length > 0" class="suggestions-container">
        <h6><span v-if="searchname.trim().length == 0" class="title">შემოთავაზებული</span></h6>
        <div v-for="(item, index) in SuggestionNames" :key="index" class="suggestion-item"
            @click="selectSuggestion(item)">
            <i class="fa-solid fa-magnifying-glass"></i> {{ item }}
        </div>
    </div>
</template>

<script>
import api from '@/api';
import { mapGetters } from 'vuex';

export default {
    name: "SearchComponent",
    computed: {
        ...mapGetters('auth', ['isAuthenticated']),
    },
    data() {
        return {
            searchname: '',
            HistoryNames: [],
            popularNames: [],
            SuggestionNames: [],
            Searchnames: [],
        }
    },
    watch: {
        searchname() {
            this.fetchSuggestions();
        }
    },
    methods: {
        async fetchSuggestions() {
            if (this.searchname.trim().length > 0) {
                this.SuggestionNames = this.Searchnames.filter((name) =>
                    name.toLowerCase().includes(this.searchname.trim().toLowerCase())
                );
            } else {
                this.SuggestionNames = [...this.Searchnames];
            }
        },

        async Search() {
            try {
                const response = await api.get("/nameforsearch");
                this.Searchnames = response.data;

                if (this.isAuthenticated) {
                    const responsehistory = await api.get("/search/user", {
                        tokenRequired: true
                    });
                    this.HistoryNames = responsehistory.data;
                }

                const responsepopular = await api.get("/search/popular");
                this.popularNames = responsepopular.data;

                this.fetchSuggestions();

            } catch (error) {
                console.log(error);
            }
        },

        selectSuggestion(item) {
            this.searchname = item;
            this.performSearch();
        },

        async savehistory() {
            try {
                await api.post("/search/add", { term: this.searchname }, {
                    tokenRequired: true
                });
            } catch (error) {
                console.error(error);
            }
        },

        performSearch() {
            if (this.isAuthenticated) {
                this.savehistory();
            }
            const currentQuery = { ...this.$route.query };

            this.$router.push({
                path: `/product`,
                query: {
                    section: currentQuery.section || 'all',
                    searchname: this.searchname,
                    page: 1,
                },
            });
        },
    },
    mounted() {
        this.Search();
    },
}
</script>
<style scoped>
.remove {
    position: absolute;
    right: 5px;
    bottom: 15px;
    font-size: 13px;
}


.search {
    display: flex;
    margin-top: 10px;
}

.search-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 90%;
    height: 40px;
    max-width: 500px;
    margin: auto;
    background: #fff;
    border: 1px solid #6d45a5;
    border-radius: 8px;
    padding: 5px;
    position: relative;
}

.search-container input {
    flex-grow: 1;
    padding: 12px 10px;
    height: 30px;
    font-size: 16px;
    border: none;
    outline: none;
    border-radius: 6px;
    width: 100%;
    color: #6d6969;
}

.search-container input::placeholder {
    color: #aaa;
}

.srchbtn {
    background: transparent;
    border: none;
    font-size: 18px;
    padding: 8px;
    height: 40px;
    color: #62389c;
    position: absolute;
}

.srchbtn {
    right: 0px;
}

.suggestions-container {
    width: 100%;
    margin: auto;
    overflow-y: auto;
    padding: 8px;
}

.suggestion-item {
    position: relative;
    display: flex;
    align-items: baseline;
    padding: 10px 15px;
    cursor: pointer;
    gap: 15px;
    border-radius: 10px;
    font-size: 0.9rem;
    color: #b1afaf;
}

.suggestion-item:hover {
    background-color: #ededed;
}

.title {
    font-size: 12px;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

h6 {
    margin: 5px auto;
}
</style>
