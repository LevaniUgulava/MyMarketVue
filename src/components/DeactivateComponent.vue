<template>
    <div v-if="open" class="modal-overlay">
        <div class="modal-container">
            <div class="modal-header">
                <h3 class="modal-title">ანგარიშის დეაქტივაცია</h3>

                <div class="modal">

                    <div class="deactivate-container">
                        <button class="close" @click="closeModal">
                            <i class="fa-solid fa-xmark"></i>
                        </button>

                        <p class="modal-info">
                            ⚠️ გაითვალისწინეთ! ანგარიშის დეაქტივაციისას წაიშლება თქვენი პირადი ინფორმაცია, შეკვეთების
                            ისტორია და ანგარიშის სტატუსი.
                        </p>
                        <div class="main">
                            <form @submit.prevent="deactivateAccount" method="post" id="form">
                                <div class="input-container">
                                    <span v-if="passwordMessagesuccess" class="success-text">{{ passwordMessagesuccess
                                    }}</span>
                                    <span v-if="passwordMessageerror" class="error-text">{{ passwordMessageerror
                                    }}</span>
                                    <input v-model="password" :class="{ 'input-error': passwordMessageerror }"
                                        :type="isPassword ? 'password' : 'text'" name="password" id="password"
                                        placeholder=" " />
                                    <label for="password">პაროლი</label>

                                    <button type="button" class="toggle-password" @click="isPassword = !isPassword"
                                        aria-label="Toggle password visibility">
                                        <i :class="isPassword ? 'fa fa-eye' : 'fa fa-eye-slash'"></i>
                                    </button>
                                </div>
                                <button class="primary-btn danger">ანგარიშის დეაქტივაცია</button>
                            </form>
                            <div class="dotted-line">
                                <span>ან</span>
                            </div>
                            <div class="email-section">
                                <form @submit.prevent="verifyemail" method="post" id="form">
                                    <div class="input-container">
                                        <span v-if="successtokenMessage" class="success-text">{{ successtokenMessage
                                        }}</span>
                                        <span v-if="errortokenMessage" class="error-text">{{ errortokenMessage }}</span>
                                        <input v-model="token" :class="{ 'input-error': errortokenMessage }"
                                            placeholder=" " />
                                        <label for="password">კოდი</label>

                                        <a class="resend" v-if="isSendEmail">
                                            {{ remainingTime }}s
                                        </a>
                                        <button v-else type="button" class="resend" @click.prevent="sendEmail"
                                            :disabled="isSendEmail">
                                            გაგზავნა
                                        </button>
                                    </div>
                                    <button class="primary-btn">ანგარიშის დეაქტივაცია ელ.ფოსტით</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/api';

export default {
    props: {
        open: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            password: "",
            isPassword: true,
            isSendEmail: false,
            passwordMessageerror: "",
            passwordMessagesuccess: "",
            token: "",
            errortokenMessage: null,
            successtokenMessage: null,
            remainingTime: 30,
            intervalId: null
        };
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
        async deactivateAccount() {
            try {
                const response = await api.post("/delete/acc", { password: this.password }, {
                    tokenRequired: true
                });
                if (response.status === 200) {
                    this.passwordMessagesuccess = "ანგარიში წაიშალა"
                    localStorage.removeItem('token');
                    localStorage.removeItem('name');
                    localStorage.removeItem('token');
                    localStorage.removeItem('roles');
                    localStorage.removeItem('userid');
                }
            } catch (error) {
                if (error.response.status === 500) {
                    this.passwordMessageerror = "ანგარიში წაშლისა მოხდა შეცდომა"
                }
                else if (error.response.status === 422) {
                    this.passwordMessageerror = "არასწორი ფორმატი"
                } else {
                    this.passwordMessageerror = "პაროლი არასწორია"
                }
            }
        },
        async verifyemail() {
            try {
                const response = await api.post("verify-deactivation-code", { code: this.token }, {
                    tokenRequired: true
                })
                if (response.status === 200) {
                    this.successtokenMessage = "წარმატებით წაიშალა ანგარიში"
                    localStorage.removeItem('token');
                    localStorage.removeItem('name');
                    localStorage.removeItem('token');
                    localStorage.removeItem('roles');
                    localStorage.removeItem('userid');
                }

            } catch (error) {
                this.errortokenMessage = "კოდი არასწორია"
            }

        },
        async sendEmail() {
            try {
                const response = await api.post("send-deactivation-email", {}, {
                    tokenRequired: true
                });
                if (response.status === 200) {
                    this.isSendEmail = true;
                    this.remainingTime = 30;
                    this.startCountdown();
                    this.saveTimerState();
                }

            } catch (error) {
                console.error(error);
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
    },
    mounted() {
        this.loadTimerState();
    },

};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}


.modal-container {
    background: #fff;
    border-radius: 12px;
    width: 100%;
    max-width: 600px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    position: relative;
    z-index: 10000;
}


.modal-header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.success {
    background-color: #ffe5e5;
    border: 1px solid #ffaea8;
    padding: 16px 24px;
    margin: 20px auto;
    border-radius: 10px;
    max-width: 600px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.5;
}

.success strong {
    font-size: 14px;
    display: block;
    margin-bottom: 8px;
}

.modal {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
}

.deactivate-container {
    padding: 10px;
    border-radius: 15px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.modal-title {
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
}


.modal-info {
    font-size: 14px;
    color: #4b5563;
    background: #f3f4f6;
    padding: 16px;
    border-left: 4px solid #ef4444;
    border-radius: 8px;
}

.error-text,
.success-text {
    position: absolute;
    top: -20px;
    right: 0;
    font-size: 12px;
    background: white;
    padding: 0 5px;
}

.success-text {
    color: green;
}

.error-text {
    color: #e74c3c;
}


.input-error {
    border: 1px solid #d62f1c !important;
}

.main {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.input-container {
    position: relative;
    margin-bottom: 30px;
}

.input-container input {
    width: 100%;
    font-size: 16px;
    text-indent: 15px;
    height: 40px;
    border: 1px solid #dbdbdb;
    border-radius: 10px;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;
}

.input-container label {
    position: absolute;
    top: 50%;
    left: 12px;
    transform: translateY(-50%);
    font-size: 14px;
    color: #aaa;
    pointer-events: none;
    padding: 0 5px;
    transition: all 0.3s ease;
}

.input-container input:focus+label,
.input-container input:not(:placeholder-shown)+label {
    top: -10px;
    font-size: 12px;
    color: #333;
}

.toggle-password {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #888;
    padding: 4px;
    z-index: 9999;
}

.resend {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 12px;
    color: #3d2dec;
    padding: 4px;
    z-index: 2;
}



.primary-btn {
    padding: 12px;
    font-size: 14px;
    width: 100%;
    border: none;
    border-radius: 8px;
    background-color: #3b82f6;
    color: white;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s;
}


.primary-btn:hover {
    background-color: #2563eb;
}


.primary-btn.danger {
    background-color: #ef4444;
}


.primary-btn.danger:hover {
    background-color: #dc2626;
}


.dotted-line {
    display: flex;
    margin-top: 30px;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
}

.dotted-line::before,
.dotted-line::after {
    content: "";
    flex-grow: 1;
    border-bottom: 1.5px dotted #dbdbdb;
    margin: 0 10px;
}

.dotted-line span {
    font-size: 12px;
    border: 1px solid #dbdbdb;
    padding: 8px;
    border-radius: 5px;
    color: #4e4c4c;
}

.close {
    position: absolute;
    top: 15px;
    right: 20px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
}

.close i {
    color: #888;
}

.close:hover i {
    color: #333;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideIn {
    from {
        transform: translateY(-20px);
    }

    to {
        transform: translateY(0);
    }
}
</style>
