<template>
    <div class="last-container">
        <div v-for="(item, index) in data" :key="index" class="last">
            <div class="last-title">
                <i :class="item.icon"></i>
                <span class="title">{{ item.title }}</span>
            </div>

            <span class="description">{{ item.description }}</span>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            data: [
                {
                    "id": 1, "icon": "fa fa-gift", "title": "სასაჩუქრე ბარათი", "description": "ახარებს საჩუქრად ელეხტრო შესაფერისი სასაჩუქრე ბარათი  პატარის ჩადეფის ვაჩუქერო!"
                },
                { "id": 2, "icon": "fa fa-shoe-prints", "title": "გაცვეთილი ორბის ტექსტის", "description": "ვიცკი მწალობით New Balance, Peak, Emporio Armani EA7" },
                { "id": 3, "icon": "fa fa-truck", "title": "ვეტრი მიწოდება", "description": "ზღავმართორად 200 ₾-ში გად აწ დასღვებასი მწეკვეტად მარტფორმ ვერებიც პირაქ ათქარჩტვ!" }
            ]
        }
    },
}
</script>

<style scoped>
.last-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    margin-top: 20px;
    gap: 20px;
}

.last {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 30%;
    gap: 20px;
    padding: 20px;
    border-radius: 12px;

}



.last i {
    font-size: 40px;
    color: #7e23fc;
    margin-bottom: 10px;
}

.title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
}

.description {
    font-size: 14px;
    color: #555;
    text-align: center;
    line-height: 1.6;
    width: 60%;

}

.last-title {
    display: flex;
    flex-direction: column;
    align-items: center;
}

@media(max-width:767px) {
    .last-container {
        flex-direction: column;
    }

    .last {
        width: 100%;
    }

    .last-title {
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;
        width: 100%;
    }

    .description {
        width: 100%;
        text-align: start;
    }
}
</style>
