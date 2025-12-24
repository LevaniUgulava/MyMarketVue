<template>
    <div>
        <div class="analitics">
            <LineChartComponent />
            <AnalyticTemplate />
        </div>
        <div>
            <CircelChartComponent :profit="600" :courier="50" :productCost="340" centerValue="500"
                centerLabel="სუფთა მოგება:" />
        </div>

    </div>
</template>
<script setup>
import AnalyticTemplate from './analytics/analyticTemplate.vue';
import CircelChartComponent from './analytics/CircelChartComponent.vue';
import LineChartComponent from './analytics/LineChartComponent.vue';


</script>
<style scoped>
.analitics {
    display: flex;
    justify-content: space-between;
}
</style>