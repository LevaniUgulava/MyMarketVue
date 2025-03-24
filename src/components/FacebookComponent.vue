<template>
  <div>

    <HFaceBookLogin v-slot="fbLogin" app-id="916852566473086" @onSuccess="onSuccess" @onFailure="onFailure"
      scope="email,public_profile" fields="id,name,email,first_name,last_name,birthday">
      <span @click="fbLogin.initFBLogin" class="facebookbtn"> <i class="fa-brands fa-facebook"></i>Login with
        Facebook</span>
    </HFaceBookLogin>
  </div>
</template>

<script>
import api from '@/api';
import { HFaceBookLogin } from '@healerlab/vue3-facebook-login';
export default {
  name: 'FacebookComponent',
  components: {
    HFaceBookLogin
  },
  methods: {
    async login(accessToken, name) {
      try {
        const response = await api.post('auth/facebook', {
          accessToken: accessToken,
          tokenRequired: false

        });
        console.log(response.data);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('roles', response.data.roles[0]);

        localStorage.setItem('name', name);
        this.$root.$emit('updateDisplayName'); // Emit a global event to update displayName if needed



      } catch (error) {
        console.log(error);
      }

    },

    onSuccess(response) {
      console.log(response);
      const accessToken = response.authResponse.accessToken;
      const name = response.authInfo.name;
      this.login(accessToken, name);
      this.$router.push('/');

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
  align-items: center;
  justify-content: center;
  width: 66%;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid black;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #3b5998;
  margin-bottom: 10px;
}

.facebookbtn:hover {
  transform: translateY(-5px);
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
}

.facebookbtn i {
  margin-right: 10px;
}

@media (min-width: 375px) and (max-width: 430px) {
  .facebookbtn {
    width: 100%;
    padding: 5px 10px;
    margin-top: 5px;
    font-size: 0.8rem;
    margin-bottom: 5px;
  }
}
</style>
