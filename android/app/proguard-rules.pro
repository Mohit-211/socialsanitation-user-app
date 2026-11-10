# react-native-config reads .env values from BuildConfig at runtime,
# so keep the class when R8/ProGuard minification is enabled.
-keep class com.socialsanitationapp.BuildConfig { *; }
