<template>
  <div class="validate-input-container pb-3">
    <input
      v-if="tag !== 'textarea'"
      class="form-control"
      :class="{ 'is-invalid': inputRef.error }"
      @blur="validateinput"
      v-model="inputRef.val"
      v-bind="$attrs"
    />
    <textarea
      v-else
      class="form-control"
      :class="{ 'is-invalid': inputRef.error }"
      @blur="validateinput"
      v-model="inputRef.val"
      v-bind="$attrs"
    />
    <span class="invalid-feedback" v-if="inputRef.error">{{
      inputRef.message
    }}</span>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  PropType,
  onMounted,
  watch,
  computed,
} from "vue";
import { emitter } from "./ValidateForm.vue";

const emailReg =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const passwordReg = /^[a-zA-Z0-9.*+/=?^_`{|}~-]*$/;
interface RuleProp {
  type: "required" | "email" | "password" | "range" | "custom";
  message: string;
  length?: number;
  validator?: () => boolean;
}
export type RulesProp = RuleProp[];
export type TagType = "input" | "textarea";

export default defineComponent({
  inheritAttrs: false,

  props: {
    rules: Array as PropType<RulesProp>,
    modelValue: String,
    tag: {
      type: String as PropType<TagType>,
      default: "input",
    },
  },
  setup(props, context) {
    const inputRef = reactive({
      val: computed({
        get: () => props.modelValue || "",
        set: (val) => {
          context.emit("update:modelValue", val);
        },
      }),
      error: false,
      message: "",
    });
    const validateinput = () => {
      if (props.rules) {
        const allPassed = props.rules.every((rule) => {
          let passed = true;
          inputRef.message = rule.message;
          switch (rule.type) {
            case "required":
              passed = inputRef.val.trim() !== "";
              break;
            case "email":
              passed = emailReg.test(inputRef.val);
              break;
            case "password":
              passed = passwordReg.test(inputRef.val);
              break;
            case "range":
              passed = inputRef.val.length >= (rule.length as number);
              break;
            case "custom":
              passed = rule.validator ? rule.validator() : true;
              break;
            default:
              break;
          }
          return passed;
        });
        inputRef.error = !allPassed;
        return allPassed;
      }
      return true;
    };
    onMounted(() => {
      emitter.emit("form-item-created", validateinput);
    });
    return {
      inputRef,
      validateinput,
    };
  },
});
</script>

<style lang="less"></style>
