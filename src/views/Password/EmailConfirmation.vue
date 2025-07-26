<template>
    <div v-if="open" class="overlay"></div>


    <div v-if="open" class="modal">
        <div class="login-wrapper">
            <div :class="['login-card', platform === 'ios' ? 'ios-padding' : '']">

                <div class="login-content">
                    <div class="title">
                        <h2>ელ.ფოსტის ვერიფიკაცია</h2>
                        <button class="close" @click="closeModal">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>


                    <div class="dotted-line">
                        <span></span>
                    </div>
                    <div class="verification-message" v-if="data.from !== 'register'">
                        <h3>ვერიფიკაციის კოდი თქვენი ელ.ფოსტაზე</h3>
                        <p>თქვენმა სისტემამ უკვე გაგზავნა ვერთიფიკაციის კოდი თქვენს ელ.ფოსტის მისამართზე. გთხოვთ,
                            შეიყვანოთ კოდი ქვემოთ მოცემულ ველში, რათა დაადასტუროთ თქვენი ანგარიში.</p>
                        <div class="email-info">
                            <p><strong>ელ.ფოსტის მისამართი:</strong> {{ data.email }}</p>
                        </div>
                        <p class="note">თუ არ მიიღეთ კოდი, შეგიძლიათ დააჭიროთ "გაგზავნა".</p>
                    </div>
                    <div class="verification-message" v-else>
                        <h3>ვერიფიკაციის კოდი თქვენი ელ.ფოსტაზე</h3>
                        <p>გაიარეთ ვერიფიკაცია, რათა გამოიყენოთ ყველა ფუნქცია და უზრუნველყოთ უსაფრთხოება, რაც საშუალებას
                            მოგცემთ წვდომა მიიღოთ სრულად ყველა სერვისზე და შესაძლებლობაზე..</p>
                        <div class="email-info">
                            <p><strong>ელ.ფოსტის მისამართი:</strong> {{ data.email }}</p>
                        </div>
                        <p class="note">კოდის მისაღებად დააჭირეთ <strong>"გაგზავნა"</strong>.</p>
                    </div>


                    <form @submit.prevent="checkOtp" method="post" id="loginform">
                        <div class="input-container">
                            <span v-if="otpError" class="error-text">{{ otpError }}</span>
                            <input v-model="otp" :class="{ 'input-error': otpError }" type="text" name="otp" id="otp"
                                placeholder="" />
                            <label for="otp">ვერიფიკაციის კოდი</label>
                            <a class="resend" v-if="isSendEmail">
                                {{ remainingTime }}s
                            </a>
                            <button v-else type="button" class="resend" @click.prevent="sendEmail"> გაგზავნა </button>
                        </div>

                        <button class="loginbtn">გაგრძელება</button>
                    </form>

                    <div class="dotted-line">
                        <span>{{ data.from === 'register' ? 'ან' : '' }}</span>
                    </div>
                    <button v-if="data.from === 'register'" @click="closeModal" class="verifypass">ვერიფიკაციის
                        გამოტოვება</button>

                    <div class="Error" v-if="ErrorName && ErrorText">
                        <strong>{{ ErrorName }}</strong>
                        <hr />
                        <p>{{ ErrorText }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import api from '@/api';
import { validateInputFields } from '@/components/utils/validate';
import { Capacitor } from '@capacitor/core';

export default {
    name: "verifyComp",
    props: ['open', 'data'],

    data() {
        return {
            otp: "",
            otpError: '',
            ErrorName: "",
            ErrorText: "",
            isSendEmail: false,
            remainingTime: 30,
            intervalId: null,
            platform: Capacitor.getPlatform()

        };
    },
    methods: {
        async sendEmail() {
            if (this.data.from === "forget") {

                try {
                    const response = await api.post('/forget/password', { email: this.data.email });

                    if (response.status === 200) {
                        this.isSendEmail = true;
                        this.remainingTime = 30;
                        this.startCountdown();
                        this.saveTimerState();
                    }
                } catch (error) {
                    if (error.response.status === 422) {
                        this.ErrorName = "არასწორი ფორმატი"
                        this.ErrorText = "გაითვალისწინეთ, პაროლი უნდა შედგებოდეს არანკლებ 8 სიმბოლოსგან, ასევე შეამოწმეთ ელ.ფოსტის ფორმატი"
                    } else if (error.response.status === 500) {
                        this.ErrorName = "არასწორი ელ.ფოსტა"
                        this.ErrorText = "ჩანაწერები არ ემთხევა"
                    }
                }
            } else {
                try {
                    const response = await api.post("/resend-verify", { email: this.data.email });
                    if (response.status === 200) {
                        this.isSendEmail = true;
                        this.remainingTime = 30;
                        this.startCountdown();
                        this.saveTimerState();
                    }
                } catch (error) {
                    console.error(error);
                }

            }
        },
        async checkOtp() {
            const valid = validateInputFields(this, [
                { model: 'otp', errorKey: 'otpError', message: 'ერთჯერადი კოდი აუცილებელია' },
            ]);

            if (!valid) return;
            try {
                if (this.data.from === "forget") {
                    const response = await api.post('/checkotp', { email: this.data.email, otp: this.otp });
                    if (response.data.success) {
                        this.$emit('openresetmodal', response.data.success);
                        this.closeModal();
                    } else {
                        console.log("failed");

                    }
                } else if (this.data.from === "register") {
                    const response = await api.post('/email/verify', { email: this.data.email, otp: this.otp });
                    if (response.data.success) {
                        this.closeModal();
                    } else {
                        console.log("failed");
                    }
                }

            } catch (error) {
                if (error.response.status === 400 || error.response.status === 422) {
                    this.ErrorName = "დროებითი კოდი არასწორია"
                    this.ErrorText = "დარწმუნდით რომ კოდი სწორია"

                }
            }
        },

        startCountdown() {
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }

            this.intervalId = setInterval(() => {
                if (this.remainingTime > 0) {
                    this.remainingTime--;
                    this.saveTimerState();
                } else {
                    this.isSendEmail = false;
                    clearInterval(this.intervalId);
                    localStorage.removeItem('remainingTime');
                }
            }, 1000);
        },
        saveTimerState() {
            localStorage.setItem('remainingTime', this.remainingTime);
            localStorage.setItem('isSendEmail', this.isSendEmail);
        },
        loadTimerState() {
            const savedTime = localStorage.getItem('remainingTime');
            const savedStatus = localStorage.getItem('isSendEmail');

            if (savedTime !== null && savedStatus !== null) {
                this.remainingTime = parseInt(savedTime, 10);
                this.isSendEmail = savedStatus === 'true';

                if (this.isSendEmail && this.remainingTime > 0) {
                    this.startCountdown();
                }
            }
        },
        closeModal() {
            this.$emit('close');
        },
    },
    mounted() {
        this.loadTimerState();
    },
};
</script>

<style scoped>
.verifypass {
    display: flex;
    margin: 20px auto;
    border: none;
    background-color: transparent;
    color: #3d2dec;
}

.Error {
    background-color: #ffe5e5;
    border: 1px solid #ffaea8;
    color: #b71c1c;
    padding: 16px 24px;
    margin: 20px auto;
    border-radius: 10px;
    max-width: 600px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    line-height: 1.5;
}

.Error strong {
    font-size: 14px;
    display: block;
    margin-bottom: 8px;
}

.Error p {
    margin: 0;
    font-size: 12px;

}

.resend {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 13px;
    color: #3d2dec;
    padding: 4px;
    z-index: 2;
}

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
  width: 365px;
  margin: auto;
  bottom: 10px;
}

#loginform {
    position: relative;
    top: 20px;
}

input {
    width: 100%;
    font-size: 16px;
    height: 50px;
    border: 1px solid #dbdbdb;
    border-radius: 10px;
    text-indent: 15px;

    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;
}

.input-error {
    border-color: #e74c3c;
}

label {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    font-size: 14px;
    color: #aaa;
    pointer-events: none;
    padding: 0 5px;
    transition: all 0.3s ease;
}

input:focus+label,
input:not(:placeholder-shown)+label {
    top: -10px;
    font-size: 12px;
    color: #333;
}

.error-text {
    position: absolute;
    bottom: -18px;
    right: 0;
    color: #e74c3c;
    font-size: 12px;
    background: white;
    padding: 0 5px;
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
    font-size: 1.5rem;
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
    max-width: 50vh;
    height: 95%;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}

.ios-padding {
    padding-top: calc(80px + env(safe-area-inset-top)) !important;
}

.close {

    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: 20px;

}

.title {
    display: flex;
    padding-top: 20px;
    margin: 0 auto 0 60px;
    justify-content: space-between;
}

@media (max-width: 768px) {
    .modal {
        position: fixed;
        top: 0px;
        right: 0px;
        width: 100vh;
        border-radius: none;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
    }

    .login-card {
        background: white;
        border-radius: 0px;
        padding: 20px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-right: 2px solid #ccc;
        height: 100%;
        box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
    }
}
</style>