import { Capacitor } from "@capacitor/core";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import {authMixin} from '@/mixin/reuse'
export const checkIfExist = async (loading, showPinPopup) => {
  if (!Capacitor.isNativePlatform() && authMixin) {
    loading.value = false;
    return;
  }

  try {
    const res = await SecureStoragePlugin.get({ key: "pincode" }).catch(() => null);
    const pinValue = res?.value ?? res;

    if (pinValue && String(pinValue).length > 0) {
      showPinPopup.value = true;
    }
  } catch (err) {
    console.error("Error checking PIN:", err);
  } finally {
    loading.value = false;
  }
};

export const setPincode=async (pincode)=>{
     await SecureStoragePlugin.set({
       key: 'pincode',
       value: pincode.toString()
    });
}
export const checkPincode=async (pincode)=>{
    try {
    const res = await SecureStoragePlugin.get({ key: 'pincode' }).catch(() => null)
    const savedPin = res?.value ?? res
    return String(pincode) === String(savedPin);
    
} catch (error) {
    error.message = 'Verification error'
}


}
export const updateAccessToken={}

export const deletePincode={}