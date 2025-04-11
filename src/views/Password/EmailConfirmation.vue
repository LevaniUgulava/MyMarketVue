<template>
    <div v-if="open" class="overlay"></div>


    <div v-if="open" class="modal">
        <div class="login-wrapper">
            <div class="login-card">
                <button class="close" @click="closeModal">
                    <i class="fa-solid fa-xmark"></i>
                </button>


                <div class="login-content">
                    <h2>ელ.ფოსტის ვერიფიკაცია</h2>
                    <div class="dotted-line">
                        <span></span>
                    </div>
                    <div class="verification-message">
                        <h3>ვერიფიკაციის კოდი თქვენი ელ.ფოსტაზე</h3>
                        <p>თქვენმა სისტემამ უკვე გაგზავნა ვერთიფიკაციის კოდი თქვენს ელ.ფოსტის მისამართზე. გთხოვთ,
                            შეიყვანოთ კოდი ქვემოთ მოცემულ ველში, რათა დაადასტუროთ თქვენი ანგარიში.</p>
                        <div class="email-info">
                            <p><strong>ელ.ფოსტის მისამართი:</strong> {{ email }}</p>
                        </div>
                        <p class="note">თუ არ მიიღეთ კოდი, შეგიძლიათ დააჭიროთ "მחדש გაგზავნა".</p>
                    </div>

                    <form @submit.prevent="checkOtp" method="post" id="loginform">
                        <div class="input-container">
                            <input v-model="otp" type="text" name="otp" id="otp" required placeholder="" />
                            <label for="otp">ვერიფიკაციის კოდი</label>
                        </div>

                        <button class="loginbtn">გაგრძელება</button>

                        <div class="dotted-line">
                            <span></span>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import api from '@/api';


export default {
    name: "verifyComp",
    props: ['open', 'email'],

    data() {
        return {
            otp: ""
        };
    },
    methods: {
        async checkOtp() {
            try {
                const response = await api.post('/checkotp', { email: this.email, otp: this.otp });
                if (response.data.success) {
                    this.$emit('openresetmodal', response.data.success);
                    this.closeModal();
                } else {
                    console.log("failed");

                }

            } catch (error) {
                console.log(error);
            }

        },
        closeModal() {
            this.$emit('close');
        },
    }
};
</script>

<style scoped>
.verification-message {
    padding: 10px;
    background-color: #f4f7fa;
    border-radius: 8px;
    border: 1px solid #e0e6ed;
    text-align: center;
    font-family: Arial, sans-serif;
    color: #333;
    margin-top: 10px;
}

.verification-message h3 {
    font-size: 13px;
    color: #000000;
    margin-bottom: 10px;
}

.verification-message p {
    font-size: 13px;
    line-height: 1.5;
    color: #666;
}

.email-info {
    background-color: #f0f4f8;
    padding: 10px;
    margin: 15px 0;
    border-radius: 4px;
    border: 1px solid #e0e6ed;
    text-align: left;
    font-weight: bold;
}

.note {
    font-size: 0.9em;
    color: #888;
    margin-top: 10px;
}

span {
    color: #7c7878;
    font-size: 14px;
}

.dotted-line {
    display: flex;
    margin-top: 30px;
    align-items: center;
    justify-content: center;
    position: relative;
    align-items: center;
    text-align: center;
    width: 100%;
}

.dotted-line::before,
.dotted-line::after {
    content: "";
    flex-grow: 1;
    border-bottom: 1.5px dotted #dbdbdb;
    margin: 0 5px;
}

.dotted-line span {
    font-size: 12px;
    border: 1px solid #dbdbdb;
    padding: 5px;
    border-radius: 5px;
    color: #4e4c4c;
}


.overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 999;
}

.modal {
    position: fixed;
    top: 10px;
    right: 10px;
    bottom: 10px;
    width: 50vh;
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

.input-container {
    position: relative;
    width: 100%;
    margin-bottom: 20px;
}

.login-content {
    position: relative;
    bottom: 10px;
}

#loginform {
    position: relative;
    top: 20px;
}

input {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    height: 50px;
    border: 1px solid #dbdbdb;
    border-radius: 10px;
    outline: none;
    background: #f9f9f9;
    transition: 0.3s;
}

input:focus+label,
input:not(:placeholder-shown)+label {
    top: -10px;
    font-size: 12px;
    color: #333;
    padding: 0 5px;
}

label {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    font-size: 14px;
    color: #aaa;
    pointer-events: none;
    transition: all 0.3s ease;
}

.loginbtn {
    padding: 12px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 8px;
    border: none;
    background-color: #62389c;
    color: white;
    width: 100%;
    font-weight: 500;
    transition: background-color 0.3s;
}

h2 {
    display: flex;
    justify-content: center;
    font-size: 16px;
    font-family: 'Roboto', sans-serif;
}

.loginbtn:hover {
    background-color: #4b6ee6;
}

.login-wrapper {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-radius: 10px;
    height: 100%;
}

.login-card {
    background: white;
    border-radius: 10px;
    padding: 20px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-right: 2px solid #ccc;
    width: 100%;
    max-width: 50vh;
    height: 100%;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}

.close {
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 10px;
    border-radius: 40%;
    font-size: 24px;
    z-index: 1000;

}
</style>