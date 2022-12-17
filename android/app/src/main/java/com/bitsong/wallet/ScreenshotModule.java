package com.bitsong.wallet;
import android.app.Activity;
import android.view.WindowManager;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;

public class ScreenshotModule extends ReactContextBaseJavaModule {
   	ScreenshotModule(ReactApplicationContext context) {
    	super(context);
   	}

   	@Override
	public String getName() {
		return "ScreenshotModule";
	}

	@ReactMethod
	public void enableScreenshotAbility() {
		Activity activity = this.getCurrentActivity();
		activity.runOnUiThread(new Runnable() {
			@Override
			public void run() {
				activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE);
			}
		});
	}

	@ReactMethod
	public void disableScreenshotAbility() {
		Activity activity = this.getCurrentActivity();
		activity.runOnUiThread(new Runnable() {
			@Override
			public void run() {
				activity.getWindow().setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE);
			}
		});
	}
}