<template>
  <div>
    <GoogleLogin class="googlebtn" :callback="handleLogin">
      <span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M 4.31016 10 C 4.31016 9.35047 4.41797 8.72766 4.61063 8.14359 L 1.24031 5.57 C 0.58344 6.90359 0.21344 8.40641 0.21344 10 C 0.21344 11.5923 0.583127 13.0941 1.23891 14.4269 L 4.60735 11.8483 C 4.41656 11.2669 4.31016 10.6464 4.31016 10 Z"
            fill="rgb(251, 188, 5)" />

          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M 10.2276 4.09094 C 11.6387 4.09094 12.9133 4.59094 13.9147 5.40906 L 16.8278 2.5 C 15.0526 0.954531 12.7767 0 10.2276 0 C 6.27014 0 2.86889 2.26312 1.2403 5.57 L 4.61045 8.14359 C 5.38701 5.78641 7.60061 4.09094 10.2276 4.09094 Z"
            fill="rgb(234, 67, 53)" />

          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M 10.2276 15.9091 C 7.60076 15.9091 5.38717 14.2136 4.61061 11.8564 L 1.2403 14.4295 C 2.86889 17.7369 6.27014 20 10.2276 20 C 12.6701 20 15.0022 19.1327 16.7523 17.5077 L 13.5533 15.0345 C 12.6506 15.6031 11.5139 15.9091 10.2276 15.9091 Z"
            fill="rgb(52, 168, 83)" />

          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M 19.7866 10 C 19.7866 9.40906 19.6955 8.77266 19.5589 8.18188 H 10.2277 V 12.0455 H 15.5989 C 15.3303 13.3628 14.5994 14.3755 13.5533 15.0345 L 16.7523 17.5077 C 18.5908 15.8014 19.7866 13.2595 19.7866 10 Z"
            fill="rgb(66, 133, 244)" />
        </svg>
        Google ავტორიზაცია</span>
    </GoogleLogin>
  </div>
</template>

<script setup>
import api from '@/api';
const handleLogin = async (googleResponse) => {
  try {
    const idToken = googleResponse.credential;

    console.log(idToken);

    const response = await api.post('google/callback', {
      tokenRequired: false,
      token: idToken
    });

    localStorage.setItem('name', response.data.name);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('roles', response.data.roles[0]);
    window.location.href = '/';
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized: Token validation failed.");
    } else {
      console.error("Login failed:", error);
    }
  }
};



</script>

<style>
.googlebtn {
  display: flex !important;
  border: 1px solid #dbdbdb;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 10px;
  margin: auto;
  width: 70%;

}

span {
  display: flex;
  align-items: center;
  gap: 10px;

}
</style>
