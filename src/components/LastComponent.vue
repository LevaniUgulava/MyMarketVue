<template>
    <div class="last-container">
        <div class="last">
            <i class="fa fa-gift"></i> <!-- Icon for "Gifting" -->
            <span class="title">სასაჩუქრე ბარათი</span>
            <span class="description">ახარებს საჩუქრად ელეხტრო შესაფერისი სასაჩუქრე ბარათი – პატარის ჩადეფის
                ვაჩუქერო!</span>
        </div>
        <div class="last">
            <i class="fa fa-shoe-prints"></i> <!-- Icon for "Shoes" -->
            <span class="title">გაცვეთილი ორბის ტექსტის</span>
            <span class="description">ვიცკი მწალობით New Balance, Peak, Emporio Armani EA7 </span>
        </div>
        <div class="last">
            <i class="fa fa-truck"></i> <!-- Icon for "Delivery" -->
            <span class="title">ვეტრი მიწოდება</span>
            <span class="description">ზღავმართორად 200 ₾-ში გად აწ დასღვებასი მწეკვეტად მარტფორმ ვერებიც პირაქ
                ათქარჩტვ!</span>
        </div>
    </div>
</template>

<script>
export default {
    // Any necessary JS can be added here
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
</style>
