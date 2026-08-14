import { COLORS } from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import {
  hasErrors,
  validateEmail,
  validatePassword,
  validateLoginForm,
  type FormErrors,
  type LoginFormValues,
} from "@/utils/validation";
import { Ionicons } from "@expo/vector-icons";
import { type Ref, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type IconName = keyof typeof Ionicons.glyphMap;
type Field = keyof LoginFormValues;

interface LoginFieldProps {
  label: string;
  value: string;
  error?: string;
  hint?: string;
  icon: IconName;
  placeholder: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address";
  secureTextEntry?: boolean;
  returnKeyType?: "next" | "done";
  onSubmitEditing?: () => void;
  inputRef?: Ref<TextInput>;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  onToggleSecure?: () => void;
}

const LoginField = ({
  label,
  value,
  error,
  hint,
  icon,
  placeholder,
  autoCapitalize = "sentences",
  keyboardType = "default",
  secureTextEntry = false,
  returnKeyType = "next",
  onSubmitEditing,
  inputRef,
  onChangeText,
  onBlur,
  onToggleSecure,
}: LoginFieldProps) => {
  const hasToggle = typeof onToggleSecure === "function";

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, error ? styles.inputRowError : null]}>
        <Ionicons name={icon} size={18} color={COLORS.inactive} style={styles.inputIcon} />
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={COLORS.inactive}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onChangeText={onChangeText}
          onBlur={onBlur}
          accessibilityLabel={label}
        />
        {hasToggle && (
          <TouchableOpacity
            onPress={onToggleSecure}
            style={styles.toggle}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel={secureTextEntry ? "Show password" : "Hide password"}
          >
            <Ionicons
              name={secureTextEntry ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={COLORS.inactive}
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
};

const validateField = (field: Field, value: string): string | undefined =>
  field === "email" ? validateEmail(value) : validatePassword(value);

export const LoginForm = () => {
  const login = useAuthStore((s) => s.login);
  const passwordRef = useRef<TextInput>(null);

  const [values, setValues] = useState<LoginFormValues>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors<LoginFormValues>>({});
  const [touched, setTouched] = useState<Record<Field, boolean>>({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (field: Field) => (text: string) => {
    setValues((prev) => ({ ...prev, [field]: text }));
    setSubmitError(null);
    // Re-validate live once the field has been touched or already shows an error.
    if (touched[field] || errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, text) }));
    }
  };

  const handleBlur = (field: Field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, values[field]) }));
  };

  const handleSubmit = async () => {
    const nextErrors = validateLoginForm(values);
    setErrors(nextErrors);
    setTouched({ email: true, password: true });

    if (hasErrors(nextErrors)) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // Simulate the network round-trip to an auth API. Replace with a real
      // `loginApi(email, password)` call when a backend is available.
      await new Promise((resolve) => setTimeout(resolve, 800));
      login(values.email.trim());
      // Navigation to the drawer group is handled automatically by the
      // `Stack.Protected` guards in src/app/_layout.tsx.
    } catch {
      setSubmitError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const canSubmit = !isSubmitting && values.email.trim().length > 0 && values.password.length > 0;

  return (
    <View style={styles.form}>
      <LoginField
        label="Email"
        value={values.email}
        error={errors.email}
        icon="mail-outline"
        placeholder="you@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
        returnKeyType="next"
        onChangeText={handleChange("email")}
        onBlur={handleBlur("email")}
        onSubmitEditing={() => passwordRef.current?.focus()}
      />

      <LoginField
        label="Password"
        value={values.password}
        error={errors.password}
        hint="At least 8 characters with a letter and a number."
        icon="lock-closed-outline"
        placeholder="Enter your password"
        secureTextEntry={!showPassword}
        returnKeyType="done"
        inputRef={passwordRef}
        onChangeText={handleChange("password")}
        onBlur={handleBlur("password")}
        onSubmitEditing={handleSubmit}
        onToggleSecure={() => setShowPassword((prev) => !prev)}
      />

      {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

      <TouchableOpacity
        style={[styles.submitButton, !canSubmit ? styles.submitButtonDisabled : null]}
        onPress={handleSubmit}
        disabled={!canSubmit}
        accessibilityRole="button"
        accessibilityLabel="Sign in"
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Sign In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.itemBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 12,
  },
  inputRowError: {
    borderColor: COLORS.favourite,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 14,
  },
  toggle: {
    paddingLeft: 8,
  },
  error: {
    color: COLORS.favourite,
    fontSize: 13,
  },
  hint: {
    color: COLORS.inactive,
    fontSize: 13,
  },
  submitError: {
    color: COLORS.favourite,
    fontSize: 14,
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: COLORS.text,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

