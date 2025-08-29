<template>
  <div>
    <HFaceBookLogin v-slot="fbLogin" app-id="916852566473086" @onSuccess="onSuccess" @onFailure="onFailure"
      scope="email,public_profile" fields="id,name,email,first_name,last_name,birthday">
      <span @click="fbLogin.initFBLogin" class="facebookbtn"> <svg xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20" width="20" height="20">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M 17.5565 0 C 18.9051 0 20 1.09492 20 2.44352 V 17.5565 C 20 18.9051 18.9051 20 17.5565 20 H 13.3976 V 12.4643 H 15.9991 L 16.4941 9.23688 H 13.3976 V 7.14246 C 13.3976 6.25953 13.8301 5.39887 15.2171 5.39887 H 16.625 V 2.65121 C 16.625 2.65121 15.3473 2.43316 14.1257 2.43316 C 11.5754 2.43316 9.90852 3.97883 9.90852 6.77707 V 9.23688 H 7.07363 V 12.4643 H 9.90852 V 20 H 2.44352 C 1.09492 20 0 18.9051 0 17.5565 V 2.44352 C 0 1.09492 1.09488 0 2.44352 0 H 17.5565 V 0 Z"
            fill="rgb(23, 119, 242)" />
        </svg>
        Facebook ავტორიზაცია</span>
    </HFaceBookLogin>
  </div>
</template>

<script>
import { getPlatform } from '@/mixin/reuse';
import { HFaceBookLogin } from '@healerlab/vue3-facebook-login';
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'FacebookComponent',
  mixins: [getPlatform],
  components: {
    HFaceBookLogin
  },
  computed: {
    ...mapGetters('auth', ['getHasPassword']),
  },
  methods: {
    ...mapActions('auth', {
      loginAction: 'facebookLogin',
    }),
    async onSuccess(response) {
      try {
        const accessToken = response.authResponse.accessToken;
        const result = await this.loginAction({
          accessToken: accessToken,
          client_type: this.platformType
        });

        if (result?.ok && !this.getHasPassword.password) {
          this.$router.push('/profile/reset');
        }
        else {
          console.error('Login failed', result?.message || 'No details');
        }
      } catch (error) {
        console.error('Unexpected error during Facebook login:', error);
      }
    },
    onFailure(error) {
      console.log('Failure: Authentication failed', error);
    }
  }
};
</script>

<style scoped>
.facebookbtn {
  display: flex;
  border: 1px solid #dbdbdb;
  gap: 10px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 10px;
  margin: auto;
  width: 70%;
}


@media (min-width: 375px) and (max-width: 430px) {}
</style>
