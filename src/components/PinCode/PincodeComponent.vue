<template>
    <div class="overlay">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />

        <div v-show="visible" class="sheet">
            <div class="user-section">
                <div class="avatar"><i class="fa-solid fa-user"></i></div>
                <div class="info">
                    <span class="label">მომხმარებელი</span>
                    <span class="email">{{ email }}</span>
                </div>
            </div>
            <div class="hint">
                <span class="title">შეიყვანეთ პასკოდი</span>

            </div>

            <div class="pin-display" :data-filled="pin.length > 0">
                <div class="dots">
                    <span v-for="i in maxLength" :key="i" class="dot" :class="{ on: i <= pin.length }"></span>
                </div>
            </div>

            <div class="button-container">
                <div class="row" v-for="(row, idx) in rows" :key="idx">
                    <button class="key" v-for="n in row" :key="n" @pointerup="onDigit(n)">
                        {{ n }}
                    </button>
                </div>

                <div class="extra-buttons">
                    <button class="action" @pointerup="onFaceId" aria-label="Face ID">
                        <img src="../../assets/svg/faceid.svg">
                    </button>

                    <button class="key zero" @pointerup="onDigit(0)">0</button>

                    <button class="action" aria-label="Delete" @pointerup="onDelete()">
                        <img src="../../assets/svg/delete.svg">
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';



export default {
    name: 'PinSheet',
    data() {
        return {
            visible: false,
            email: localStorage.getItem('email'),
            pin: '',
            maxLength: 4,
            numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            status: '',
            statusType: '',
            longPressTimer: null,
        };
    },
    computed: {
        rows() {
            return [this.numbers.slice(0, 3), this.numbers.slice(3, 6), this.numbers.slice(6, 9)];
        }
    },
    watch: {
        pin(newVal) {
            if (newVal.length === this.maxLength) {
                this.verify()
            }
        }
    },
    methods: {
        async verify() {
            try {
                const res = await SecureStoragePlugin.get({ key: 'pincode' }).catch(() => null)
                const savedPin = res?.value ?? res
                if (String(this.pin) === String(savedPin)) {
                    this.$emit('unlocked')
                }
            } catch (error) {
                error.message = 'Verification error'
            }
        },
        open() {
            this.visible = true;
        },

        onDigit(n) {
            if (this.pin.length >= this.maxLength) return;
            this.pin += String(n);
        },

        onDelete() {
            if (!this.pin) return;
            this.pin = this.pin.slice(0, -1);
        },

        flashStatus(text, type = '') {
            this.status = text;
            this.statusType = type;
            if (type) {
                setTimeout(() => {
                    this.status = '';
                    this.statusType = '';
                }, 1600);
            }
        },
    },
    mounted() {
        requestAnimationFrame(() => {
            this.open();
        });
    }
}

</script>

<style scoped>
.overlay {
    position: fixed;
    inset: 0;
    z-index: 9998;
    background-image: url('@/assets/image.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.sheet {
    position: fixed;
    left: 0;
    bottom: 0;
    transform: translateX(-50%);
    width: 95vw;
    background-color: white;
    padding: 16px 14px 20px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    box-shadow: 0 20px 50px rgba(23, 23, 23, 0.45);
    border: 1px solid rgba(255, 255, 255, .08);
    z-index: 9999;
    animation: sheetIn 1s ease-out forwards;
}

@keyframes sheetIn {
    from {
        transform: translateY(100%);
    }

    to {
        transform: translateY(0);
    }
}

.hint {
    display: flex;
    justify-content: center;
    font-size: 14px;
}

.user-section .info {
    display: flex;
    flex-direction: column;
}

.user-section {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 4px 8px 12px;
    border-bottom: 1px solid rgba(255, 255, 255, .06);
    margin: 0 2px 10px;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 999px;
    display: grid;
    place-items: center;

}

.user-section .label {
    font-size: 12px;
    color: #888;
    line-height: 1;
}

.user-section .email {
    font-size: 14px;
    line-height: 1.2;
}

.pin-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 8px 10px 6px;
    margin: 6px 4px 8px;
}

.pin-display .dots {
    display: flex;
    gap: 10px;
    align-items: center;
}

.dot {
    width: 12px;
    height: 12px;
    background-color: gray;
    border-radius: 10px;

}

.dot.on {
    background: black;
}

.button-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 6px 4px 0;
}

.row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.key {
    height: 68px;
    border: none;
    border-radius: 16px;
    font-size: 22px;
    font-weight: 600;
    color: black;
    background-color: white;
}



.extra-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    padding-top: 4px;
}

.action {
    height: 68px;
    border: none;
    border-radius: 16px;
    display: grid;
    font-size: 22px;
    place-items: center;
    background-color: white;

}


.zero {
    font-size: 22px;
}


@media (max-width:380px) {
    .sheet {
        width: 96vw;
        padding: 14px 10px 16px;
    }

    .key,
    .action {
        height: 60px;
        border-radius: 14px;
    }
}
</style>
