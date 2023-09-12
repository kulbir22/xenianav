package com.xenia;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.util.Log;

import androidx.annotation.NonNull;

public class HelloWorldModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactApplicationContext;
    HelloWorldModule(ReactApplicationContext reactContext) {
        super(reactContext); //required by React Native
        reactApplicationContext = reactContext;
    }

    @NonNull
    @Override
    //getName is required to define the name of the module represented in JavaScript
    public String getName() {
        return "HelloWorldModule";
    }

    @ReactMethod
    public void createHelloWorldEvent(String name, String location) {
        Log.d("HelloWorldModule", "My name is: " + name
                + " and location: " + location);
    }
}
