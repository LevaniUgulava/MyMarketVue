<template>
    <div class="set" v-if="open">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />


        <div class="user-section">
            <img @pointerup="closemodal" src="../../assets/svg/back.svg">
        </div>

        <div class="info-container">
            <div class="avatar"><i class="fa-solid fa-user"></i></div>
            <div class="info">
                <span class="label">მომხმარებელი</span>
                <span class="email">{{ email }}</span>
            </div>
        </div>

        <div class="hint">
            <span class="title">{{ step === 1 ? "შეიყვანეთ პასკოდი" : "გაიმეორეთ პასკოდი" }}</span>
        </div>

        <div class="pin-display" :data-filled="pin.length > 0 || confirmpin.length > 0">
            <div class="dots">
                <span v-for="i in maxLength" :key="i" class="dot"
                    :class="{ on: i <= (step === 1 ? pin.length : confirmpin.length) }"></span>
            </div>
        </div>

        <div class="button-container">
            <div class="row" v-for="(row, idx) in rows" :key="idx">
                <button class="key" v-for="n in row" :key="n" @pointerup="onDigit(n)">
                    {{ n }}
                </button>
            </div>
            <div class="row">
                <button class="key empty"></button>
                <button class="key" @pointerup="onDigit(0)">0</button>
                <button class="key delete" @pointerup="onDelete">
                    ⌫
                </button>
            </div>
        </div>

        <div v-if="pinStatus === 'confirmed'" class="confirmation">
            <span>PIN კოდი წარმატებით დადასტურდა!</span>
        </div>

        <div v-if="pinStatus === 'error'" class="confirmation error">
            <span>PIN კოდები არ ემთხვევა. გთხოვთ სცადეთ თავიდან.</span>
        </div>
    </div>
</template>

<script>
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

export default {
    props: {
        open: {
            Type: Boolean,
            default: false
        }
    },
    data() {
        return {
            email: localStorage.getItem('email'),
            pin: '',
            confirmpin: '',
            maxLength: 4,
            numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            step: 1,
            pinStatus: '',
        }
    },
    computed: {
        rows() {
            return [
                this.numbers.slice(0, 3),
                this.numbers.slice(3, 6),
                this.numbers.slice(6, 9)
            ];
        }
    },
    methods: {
        closemodal() {
            this.$emit("close");
        },
        onDigit(n) {
            if (this.step === 1 && this.pin.length < this.maxLength) {
                this.pin += n;
            } else if (this.step === 2 && this.confirmpin.length < this.maxLength) {
                this.confirmpin += n;
            }
        },
        onDelete() {
            if (this.step === 1) {
                this.pin = this.pin.slice(0, -1);
            } else if (this.step === 2) {
                this.confirmpin = this.confirmpin.slice(0, -1);
            }
        },
        confirmPin() {
            if (this.pin === this.confirmpin) {
                this.pinStatus = 'confirmed';
                this.setPincode(this.pin);
                setTimeout(() => {
                    this.pin = '';
                    this.confirmpin = '';
                    this.step = 1;
                    this.pinStatus = '';
                }, 3000);
            } else {
                this.pinStatus = 'error';
                setTimeout(() => {
                    this.pin = '';
                    this.confirmpin = '';
                    this.step = 1;
                    this.pinStatus = '';
                }, 3000);
            }
        },
        async setPincode(pincode) {
            await SecureStoragePlugin.set({
                key: 'pincode',
                value: pincode.toString()
            });
        }
    },
    watch: {
        pin() {
            if (this.pin.length === this.maxLength && this.step === 1) {
                this.step = 2;
            }
        },
        confirmpin() {
            if (this.confirmpin.length === this.maxLength && this.step === 2) {
                this.confirmPin();
            }
        }
    }
}
</script>

<style scoped>
.set {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.user-section {
    display: flex;
    align-items: center;
    gap: 20px;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid #ddd;
}

.info {
    display: flex;
    flex-direction: column;
}

.info-container {
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
}

.info .label {
    font-size: 14px;
    color: #888;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 999px;
    background: #f2f2f2;
    display: grid;
    place-items: center;
}

.hint {
    display: flex;
    justify-content: center;
    font-size: 16px;
    margin-top: 20px;
    font-weight: 500;
}

.pin-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    margin: 20px 0;
}

.dots {
    display: flex;
    gap: 16px;
}

.dot {
    width: 14px;
    height: 14px;
    background-color: #d0d0d0;
    border-radius: 50%;
    transition: background-color 0.2s ease;
}

.dot.on {
    background: #000;
}

.button-container {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: auto;
    padding-bottom: 40px;
}

.row {
    display: flex;
    justify-content: center;
    gap: 20px;
}

.key {
    height: 72px;
    width: 72px;
    border: none;
    border-radius: 50%;
    font-size: 24px;
    font-weight: 500;
    background: #f5f5f5;
    color: #000;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    transition: background 0.15s ease;
}

.key:active {
    background: #e0e0e0;
}

.key.empty {
    background: transparent;
    box-shadow: none;
}

.key.delete {
    font-size: 20px;
}

.confirmation {
    text-align: center;
    margin-top: 20px;
    font-size: 18px;
}

.confirmation.error {
    color: red;
}

.confirmation {
    color: #4CAF50;
}
</style>
