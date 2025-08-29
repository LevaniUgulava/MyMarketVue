<template>
    <div class="advertise-container">
        <div class="left">
            <img src="../assets/image-test/კლასიკური ბრენდბი.png">
            <p>ყველაზე გაყიდვადი <img src="../assets/svg/arrow-down.svg"></p>
            <div class="btns">
                <button class="btn">ბრენდები</button>
                <button class="btn">კატეგორიები</button>
                <button class="btn">პროდუქციები</button>

            </div>
        </div>
        <div class="right">
            <img src="../assets/image-test/Screenshot 2025-08-14 at 23.31.40.png">
            <img src="../assets/image-test/Screenshot 2025-08-14 at 23.31.59.png">
        </div>
    </div>
</template>
<script>
export default {

}
</script>
<style scoped>
.advertise-container {
    display: flex;
    flex-direction: row;
    padding: 10px;
    width: 100%;
    justify-content: space-between;
}

.left,
.right {
    display: flex;
    padding: 10px;
}

.left {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 40%;

}

.left p {
    color: #868689;

}

.right {
    gap: 10px;
    width: 50%;

}

.btn {
    padding: 10px 20px;
    background-color: transparent;
    border: 1px solid #7c317c;
    border-radius: 10px;
    color: #7c317c;
}

.btns {
    display: flex;
    flex-direction: row;
    gap: 5px;
}

.right img {
    width: 50%;
}

.btn:hover {
    background-color: #7c317c;
    color: white;
    cursor: pointer;
}
</style>