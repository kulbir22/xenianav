package com.xenia;

import com.facebook.react.bridge.JSIModulePackage;
// import com.swmansion.reanimated.ReanimatedJSIModulePackage;
import android.app.Application;
//import android.support.multidex.MultiDexApplication;
import com.facebook.react.PackageList;
// import com.airbnb.android.react.maps.MapsPackage;
import com.facebook.react.ReactApplication;
import com.swmansion.gesturehandler.RNGestureHandlerPackage;
// import iyegoroff.RNTextGradient.RNTextGradientPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
// import com.masteratul.RNAppstoreVersionCheckerPackage;
//import com.marianhello.bgloc.react.BackgroundGeolocationPackage;
// import com.reactnativecommunity.progressview.RNCProgressViewPackage;
// import com.reactnativecommunity.androidprogressbar.RNCProgressBarPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.eko.RNBackgroundDownloaderPackage;
import com.hopding.pdflib.PDFLibPackage;
import com.rnfs.RNFSPackage;
//mport com.keyee.pdfview.PDFView;
//import com.reactlibrary.PdfLibPackage;
// import com.reactlibrary.RNPdfScannerPackage;
// import com.github.reactnativecommunity.location.RNLocationPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
// import com.bugsnag.BugsnagReactNative;
//import com.reactnativecommunity.geolocation.GeolocationPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import com.oblador.vectoricons.VectorIconsPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.imagepicker.ImagePickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import java.util.List;
//import com.christopherdro.htmltopdf.RNHTMLtoPDFPackage;
import com.facebook.react.shell.MainReactPackage;
//import io.invertase.firebase.RNFirebasePackage;

import com.horcrux.svg.SvgPackage;
// import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
//import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

import com.heanoria.library.reactnative.locationenabler.RNAndroidLocationEnablerPackage;

public class MainApplication extends Application implements ReactApplication {
//public class MainApplication extends MultiDexApplication implements ReactApplication {
  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
           // packages.add();
           //packages.add(new RNFirebaseMessagingPackage());
           //packages.add(new ReactNativeFirebaseNotificationsPackage());
           //packages.add(new MainReactPackage(),
            new RNGestureHandlerPackage();
            // new RNTextGradientPackage();
            new RNSoundPackage();
            new ReactNativePushNotificationPackage();
            new MainReactPackage();
            new VectorIconsPackage();
            new RNBackgroundDownloaderPackage();
//            new RNHTMLtoPDFPackage();
            // new MapsPackage();
            //new BackgroundGeolocationPackage();
            //new GeolocationPackage();
            //packages.add(new PDFLibPackage());
            //packages.add(new RNFSPackage());
          //  packages.add(new RNAndroidLocationEnablerPackage());

          return packages;
        }

        // @Override
        //   protected JSIModulePackage getJSIModulePackage() { 
        //     return new ReanimatedJSIModulePackage(); 
        // }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }
        @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }
}
