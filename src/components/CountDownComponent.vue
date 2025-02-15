<template>
<div class="timer-container">
  <div class="timer-horizontal">
    <div class="header">{{header}}</div>
    <div class="timer-display" v-if="showcountdown">
      <div class="time-group">
        <span class="time">{{ countdown.days }}</span>
        <span class="label">Days</span>
      </div>
      <div class="time-group">
        <span class="time">{{ countdown.hours }}</span>
        <span class="label">Hours</span>
      </div>
      <div class="time-group">
        <span class="time">{{ countdown.minutes }}</span>
        <span class="label">Minutes</span>
      </div>
      <div class="time-group">
        <span class="time">{{ countdown.seconds }}</span>
        <span class="label">Seconds</span>
      </div>
    </div>
  </div>
</div>

</template>



<script>
export default {
  props: {
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
  },
  data() {
    return {
      countdown: {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      },
      header: "",
      isEnded:false,
      showcountdown:true
    };
  },
  methods: {
    updateCountdown() {
      const now = new Date();

      if (now < this.startTime) {
        const timeUntilStart = this.startTime - now;
        this.header = "Start in:";
        this.calculateTime(timeUntilStart);
        return;
      }
      const timeUntilEnd = this.endTime - now;
      if (timeUntilEnd > 0) {
        this.header = "End in:";
        this.calculateTime(timeUntilEnd);
      } else {
        this.header = "Event has ended.";

        this.showcountdown=false;
        this.isEnded=true;
        this.$emit("isEnded",this.isEnded);
        this.resetCountdown();
      }
    },
    calculateTime(milliseconds) {
      const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
      const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

      this.countdown = {
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      };
    },
    resetCountdown() {
      this.countdown = { days: "00", hours: "00", minutes: "00", seconds: "00" };
    },
  },
  mounted() {
    this.updateCountdown(); // Initial call
    this.timer = setInterval(this.updateCountdown, 1000); 
  },
  beforeUnmount() {
    clearInterval(this.timer); 
  },
};

</script>

<style scoped>
/* Timer Container */
.timer-container {
  text-align: center;
  font-family: 'Poppins', sans-serif;
  color: #495057;
  padding: 10px;
  max-width: 600px;
  margin: auto;
}

.timer-horizontal {
  display: flex;
  align-items: center; 
  justify-content: center;
  gap: 20px; 
}

.header {
 font-size: 1.2rem;
  font-weight: bold;
  color: #495057; 
  text-align: center;
  margin-bottom: 10px; 
  text-transform: uppercase; 
  letter-spacing: 1px; 
  background: #f8f9fa; 
  padding: 5px 10px; 
  border-radius: 5px; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
}

.timer-display {
  display: flex;
  gap: 15px; 
  font-weight: bold;
  color: #343a40;
}

.time-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time {
  font-size: 1.5rem;
  background: #e9ecef;
  padding: 5px 10px;
  border-radius: 5px;
}

.label {
  font-size: 0.6rem;
  color: #6c757d;
  margin-top: 5px;
  text-transform: uppercase;
}

</style>
