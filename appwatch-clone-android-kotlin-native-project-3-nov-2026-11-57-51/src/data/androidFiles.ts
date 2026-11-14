export interface AndroidFile {
  path: string;
  language: string;
  content: string;
  description: string;
}

export const ANDROID_FILES: AndroidFile[] = [
  // 1. build.gradle.kts (racine)
  {
    path: "build.gradle.kts",
    language: "kotlin",
    description: "Script de build racine déclarant les plugins Android et Kotlin.",
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    id("com.android.application") version "8.5.2" apply false
    id("org.jetbrains.kotlin.android") version "1.9.24" apply false
}
`
  },
  // 2. settings.gradle.kts
  {
    path: "settings.gradle.kts",
    language: "kotlin",
    description: "Paramètres Gradle définissant les dépôts Google/Maven et le module :app.",
    content: `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "AppWatchClone"
include(":app")
`
  },
  // 3. gradle.properties
  {
    path: "gradle.properties",
    language: "properties",
    description: "Propriétés JVM et configuration AndroidX / Jetifier.",
    content: `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
kotlin.code.style=official
android.nonTransitiveRClass=true
`
  },
  // 4. app/build.gradle.kts
  {
    path: "app/build.gradle.kts",
    language: "kotlin",
    description: "Configuration du module :app avec Material 3, Navigation Component, ViewBinding.",
    content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.example.appwatchclone"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.appwatchclone"
        minSdk = 23
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        viewBinding = true
    }
}

dependencies {
    // AndroidX Core & AppCompat
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")

    // Material Design 3
    implementation("com.google.android.material:material:1.12.0")

    // UI Layouts
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation("androidx.recyclerview:recyclerview:1.3.2")
    implementation("androidx.cardview:cardview:1.0.0")
    implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")

    // Navigation Component (Fragments)
    implementation("androidx.navigation:navigation-fragment-ktx:2.7.7")
    implementation("androidx.navigation:navigation-ui-ktx:2.7.7")

    // Lifecycle & Coroutines
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.8.4")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.4")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")
}
`
  },
  // 5. app/src/main/AndroidManifest.xml
  {
    path: "app/src/main/AndroidManifest.xml",
    language: "xml",
    description: "Manifeste avec permissions PACKAGE_USAGE_STATS, Foreground Service et queries pour les icônes d'apps.",
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <!-- Permission système essentielle pour l'accès aux statistiques d'usage -->
    <uses-permission
        android:name="android.permission.PACKAGE_USAGE_STATS"
        tools:ignore="ProtectedPermissions" />

    <!-- Visibilité des packages pour charger les noms et icônes d'applications réelles -->
    <uses-permission
        android:name="android.permission.QUERY_ALL_PACKAGES"
        tools:ignore="QueryAllPackagesPermission" />

    <!-- Permissions du Foreground Service (Android 9+) et notifications (Android 13+) -->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_SPECIAL_USE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <queries>
        <intent>
            <action android:name="android.intent.action.MAIN" />
        </intent>
    </queries>

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AppWatchClone">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <service
            android:name=".UsageMonitorService"
            android:enabled="true"
            android:exported="false"
            android:foregroundServiceType="specialUse">
            <property
                android:name="android.app.PROPERTY_SPECIAL_USE_FGS_SUBTYPE"
                android:value="Surveillance de l'historique d'exécution des applications" />
        </service>

    </application>

</manifest>
`
  },
  // 6. app/src/main/res/values/colors.xml
  {
    path: "app/src/main/res/values/colors.xml",
    language: "xml",
    description: "Palette de couleurs Material Design 3 (bleu, vert secondaire, surfaces et erreurs).",
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primary">#4A90E2</color>
    <color name="primaryDark">#2C5E9E</color>
    <color name="primaryLight">#D6E6F8</color>
    <color name="secondary">#50C878</color>
    <color name="secondaryDark">#368D53</color>

    <color name="background">#F5F5F7</color>
    <color name="surface">#FFFFFF</color>
    <color name="surfaceVariant">#EAEAEA</color>

    <color name="onPrimary">#FFFFFF</color>
    <color name="onSecondary">#FFFFFF</color>
    <color name="onBackground">#1C1B1F</color>
    <color name="onSurface">#1C1B1F</color>
    <color name="textSecondary">#757575</color>

    <color name="error">#E53935</color>
    <color name="onError">#FFFFFF</color>

    <color name="gradient_start">#1B1B3A</color>
    <color name="gradient_end">#4A90E2</color>
</resources>
`
  },
  // 7. app/src/main/res/values/themes.xml
  {
    path: "app/src/main/res/values/themes.xml",
    language: "xml",
    description: "Thème clair Material Design 3 sans ActionBar avec support Edge-to-Edge.",
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.AppWatchClone" parent="Theme.Material3.DayNight.NoActionBar">
        <item name="colorPrimary">@color/primary</item>
        <item name="colorOnPrimary">@color/onPrimary</item>
        <item name="colorSecondary">@color/secondary</item>
        <item name="colorOnSecondary">@color/onSecondary</item>
        <item name="android:colorBackground">@color/background</item>
        <item name="colorSurface">@color/surface</item>
        <item name="colorOnSurface">@color/onSurface</item>
        <item name="colorError">@color/error</item>
        <item name="colorOnError">@color/onError</item>

        <item name="android:statusBarColor">@android:color/transparent</item>
        <item name="android:navigationBarColor">@android:color/transparent</item>
        <item name="android:windowLightStatusBar">true</item>
        <item name="android:windowLightNavigationBar">true</item>
    </style>
</resources>
`
  },
  // 8. app/src/main/res/values-night/themes.xml
  {
    path: "app/src/main/res/values-night/themes.xml",
    language: "xml",
    description: "Thème sombre Material Design 3 AMOLED.",
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.AppWatchClone" parent="Theme.Material3.DayNight.NoActionBar">
        <item name="colorPrimary">#6BA8EF</item>
        <item name="colorOnPrimary">#0A1D38</item>
        <item name="colorSecondary">#6CE092</item>
        <item name="colorOnSecondary">#0B3419</item>
        <item name="android:colorBackground">#121212</item>
        <item name="colorSurface">#1E1E1E</item>
        <item name="colorOnSurface">#E0E0E0</item>
        <item name="colorError">#EF5350</item>
        <item name="colorOnError">#370001</item>

        <item name="android:statusBarColor">@android:color/transparent</item>
        <item name="android:navigationBarColor">@android:color/transparent</item>
        <item name="android:windowLightStatusBar">false</item>
        <item name="android:windowLightNavigationBar">false</item>
    </style>
</resources>
`
  },
  // 9. app/src/main/res/values/strings.xml
  {
    path: "app/src/main/res/values/strings.xml",
    language: "xml",
    description: "Ressources textuelles en français pour l'ensemble des écrans.",
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">AppWatch Clone</string>
    <string name="app_tagline">Protection publicitaire et détection d'apps intrusives</string>

    <!-- Navigation -->
    <string name="nav_home">Accueil</string>
    <string name="nav_history">Historique</string>
    <string name="nav_settings">Paramètres</string>

    <!-- Écran Accueil -->
    <string name="card_permission_title">Accès à l'utilisation</string>
    <string name="card_permission_desc">Nécessaire pour détecter les applications ouvertes en temps réel.</string>
    <string name="btn_grant_permission">Autoriser l'accès</string>
    <string name="permission_granted">Permission accordée</string>

    <string name="card_service_title">Surveillance active</string>
    <string name="card_service_desc">Surveille les applications en arrière-plan et enregistre les lancements.</string>

    <string name="card_counter_title">Applications surveillées</string>
    <string name="card_counter_desc">Nombre d'applications enregistrées dans l'historique récent.</string>

    <!-- Écran Historique -->
    <string name="history_title">Historique des lancements</string>
    <string name="history_empty">Aucun historique enregistré</string>
    <string name="history_empty_hint">Activez la surveillance pour capturer les applications ouvertes.</string>
    <string name="btn_uninstall">Désinstaller</string>
    <string name="btn_clear_history">Vider l'historique</string>

    <!-- Écran Paramètres -->
    <string name="settings_title">Paramètres de surveillance</string>
    <string name="settings_interval">Intervalle d'analyse : 5 secondes</string>
    <string name="settings_max_entries">Historique maximal : 50 applications</string>
    <string name="settings_support">Assistance &amp; Dépannage (ExtraTech)</string>
    <string name="settings_support_phone">0661460899</string>

    <!-- Notifications -->
    <string name="notification_channel_name">Surveillance AppWatch Clone</string>
    <string name="notification_title">AppWatch Clone est actif</string>
    <string name="notification_content">Surveillance des applications récentes en arrière-plan...</string>
    <string name="notification_stop">Arrêter</string>
</resources>
`
  },
  // 10. app/src/main/res/values/dimens.xml
  {
    path: "app/src/main/res/values/dimens.xml",
    language: "xml",
    description: "Dimensions standardisées pour les marges, rayons de courbure et élévations.",
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <dimen name="spacing_tiny">4dp</dimen>
    <dimen name="spacing_small">8dp</dimen>
    <dimen name="spacing_medium">16dp</dimen>
    <dimen name="spacing_large">24dp</dimen>
    <dimen name="spacing_xlarge">32dp</dimen>

    <dimen name="card_corner_radius">16dp</dimen>
    <dimen name="card_elevation">4dp</dimen>
    <dimen name="app_icon_size">48dp</dimen>
    <dimen name="header_icon_size">72dp</dimen>
</resources>
`
  },
  // 11. app/src/main/res/drawable/ic_home.xml
  {
    path: "app/src/main/res/drawable/ic_home.xml",
    language: "xml",
    description: "Icône vectorielle Accueil (maison).",
    content: `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="@android:color/white"
        android:pathData="M10,20v-6h4v6h5v-8h3L12,3 2,12h3v8z" />
</vector>
`
  },
  // 12. app/src/main/res/drawable/ic_history.xml
  {
    path: "app/src/main/res/drawable/ic_history.xml",
    language: "xml",
    description: "Icône vectorielle Historique (horloge).",
    content: `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="@android:color/white"
        android:pathData="M13,3c-4.97,0 -9,4.03 -9,9H1l3.89,3.89 0.07,0.14L9,12H6c0,-3.87 3.13,-7 7,-7s7,3.13 7,7 -3.13,7 -7,7c-1.93,0 -3.68,-0.79 -4.94,-2.06l-1.42,1.42C8.27,19.99 10.51,21 13,21c4.97,0 9,-4.03 9,-9s-4.03,-9 -9,-9zm-1,5v5l4.28,2.54 0.72,-1.21 -3.5,-2.08V8H12z" />
</vector>
`
  },
  // 13. app/src/main/res/drawable/ic_settings.xml
  {
    path: "app/src/main/res/drawable/ic_settings.xml",
    language: "xml",
    description: "Icône vectorielle Paramètres (engrenage).",
    content: `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="@android:color/white"
        android:pathData="M19.14,12.94c0.04,-0.3 0.06,-0.61 0.06,-0.94 0,-0.32 -0.02,-0.64 -0.07,-0.94l2.03,-1.58c0.18,-0.14 0.23,-0.41 0.12,-0.61l-1.92,-3.32c-0.12,-0.22 -0.37,-0.29 -0.59,-0.22l-2.39,0.96c-0.5,-0.38 -1.03,-0.7 -1.62,-0.94l-0.36,-2.54c-0.04,-0.24 -0.24,-0.41 -0.48,-0.41h-3.84c-0.24,0 -0.43,0.17 -0.47,0.41l-0.36,2.54c-0.59,0.24 -1.13,0.57 -1.62,0.94l-2.39,-0.96c-0.22,-0.08 -0.47,0 -0.59,0.22L2.74,8.87c-0.12,0.21 -0.08,0.47 0.12,0.61l2.03,1.58c-0.05,0.3 -0.09,0.63 -0.09,0.94s0.02,0.64 0.07,0.94l-2.03,1.58c-0.18,0.14 -0.23,0.41 -0.12,0.61l1.92,3.32c0.12,0.22 0.37,0.29 0.59,0.22l2.39,-0.96c0.5,0.38 1.03,0.7 1.62,0.94l0.36,2.54c0.05,0.24 0.24,0.41 0.48,0.41h3.84c0.24,0 0.44,-0.17 0.47,-0.41l0.36,-2.54c0.59,-0.24 1.13,-0.56 1.62,-0.94l2.39,0.96c0.22,0.08 0.47,0 0.59,-0.22l1.92,-3.32c0.12,-0.22 0.07,-0.47 -0.12,-0.61l-2.01,-1.58zM12,15.6c-1.98,0 -3.6,-1.62 -3.6,-3.6s1.62,-3.6 3.6,-3.6 3.6,1.62 3.6,3.6 -1.62,3.6 -3.6,3.6z" />
</vector>
`
  },
  // 14. app/src/main/res/drawable/ic_shield.xml
  {
    path: "app/src/main/res/drawable/ic_shield.xml",
    language: "xml",
    description: "Icône vectorielle Bouclier de protection pour l'accueil.",
    content: `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="@color/primary"
        android:pathData="M12,1L3,5v6c0,5.55 3.84,10.74 9,12 5.16,-1.26 9,-6.45 9,-12V5l-9,-4zm-2,16l-4,-4 1.41,-1.41L10,14.17l6.59,-6.59L18,9l-8,8z" />
</vector>
`
  },
  // 15. app/src/main/res/drawable/ic_delete.xml
  {
    path: "app/src/main/res/drawable/ic_delete.xml",
    language: "xml",
    description: "Icône vectorielle Poubelle rouge pour l'action de désinstallation.",
    content: `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="@color/error"
        android:pathData="M6,19c0,1.1 0.9,2 2,2h8c1.1,0 2,-0.9 2,-2V7H6v12zM19,4h-3.5l-1,-1h-5l-1,1H5v2h14V4z" />
</vector>
`
  },
  // 16. app/src/main/res/drawable/ic_refresh.xml
  {
    path: "app/src/main/res/drawable/ic_refresh.xml",
    language: "xml",
    description: "Icône vectorielle Rafraîchir pour réactualiser l'historique.",
    content: `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="@color/primary"
        android:pathData="M17.65,6.35C16.2,4.9 14.21,4 12,4c-4.42,0 -7.99,3.58 -7.99,8s3.57,8 7.99,8c3.73,0 6.84,-2.55 7.73,-6h-2.08c-0.82,2.33 -3.04,4 -5.65,4 -3.31,0 -6,-2.69 -6,-6s2.69,-6 6,-6c1.66,0 3.14,0.69 4.22,1.78L13,11h7V4l-2.35,2.35z" />
</vector>
`
  },
  // 17. app/src/main/res/drawable/bg_gradient.xml
  {
    path: "app/src/main/res/drawable/bg_gradient.xml",
    language: "xml",
    description: "Dégradé de fond sombre et moderne pour l'écran d'accueil.",
    content: `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle">
    <gradient
        android:angle="135"
        android:startColor="#0F172A"
        android:centerColor="#1E1B4B"
        android:endColor="#312E81"
        android:type="linear" />
</shape>
`
  },
  // 18. app/src/main/res/drawable/card_background.xml
  {
    path: "app/src/main/res/drawable/card_background.xml",
    language: "xml",
    description: "Forme arrondie pour les cartes Material Design.",
    content: `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle">
    <solid android:color="@color/surface" />
    <corners android:radius="@dimen/card_corner_radius" />
</shape>
`
  },
  // 19. app/src/main/res/layout/activity_main.xml
  {
    path: "app/src/main/res/layout/activity_main.xml",
    language: "xml",
    description: "Layout principal contenant le FragmentContainerView et le BottomNavigationView.",
    content: `<?xml version="1.0" encoding="utf-8"?>
<androidx.coordinatorlayout.widget.CoordinatorLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/coordinatorLayout"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:fitsSystemWindows="true">

    <androidx.fragment.app.FragmentContainerView
        android:id="@+id/nav_host_fragment"
        android:name="androidx.navigation.fragment.NavHostFragment"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_marginBottom="64dp"
        app:defaultNavHost="true"
        app:navGraph="@navigation/nav_graph" />

    <com.google.android.material.bottomnavigation.BottomNavigationView
        android:id="@+id/bottomNavigation"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_gravity="bottom"
        android:background="@color/surface"
        app:elevation="8dp"
        app:itemIconTint="@color/primary"
        app:itemTextColor="@color/primary"
        app:menu="@menu/bottom_nav_menu" />

</androidx.coordinatorlayout.widget.CoordinatorLayout>
`
  },
  // 20. app/src/main/res/layout/fragment_home.xml
  {
    path: "app/src/main/res/layout/fragment_home.xml",
    language: "xml",
    description: "Écran d'accueil avec dégradé sombre, logo bouclier, switch surveillance et cartes d'état.",
    content: `<?xml version="1.0" encoding="utf-8"?>
<androidx.core.widget.NestedScrollView
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@drawable/bg_gradient"
    android:fillViewport="true">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="20dp">

        <!-- En-tête avec Bouclier et Titre -->
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:gravity="center"
            android:orientation="vertical"
            android:paddingTop="32dp"
            android:paddingBottom="24dp">

            <ImageView
                android:id="@+id/ivShieldLogo"
                android:layout_width="80dp"
                android:layout_height="80dp"
                android:src="@drawable/ic_shield"
                app:tint="#60A5FA" />

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginTop="12dp"
                android:text="@string/app_name"
                android:textColor="#FFFFFF"
                android:textSize="26sp"
                android:textStyle="bold" />

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginTop="4dp"
                android:text="@string/app_tagline"
                android:textColor="#94A3B8"
                android:textSize="13sp" />
        </LinearLayout>

        <!-- Carte 1 : Statut de la Permission -->
        <com.google.android.material.card.MaterialCardView
            android:id="@+id/cardPermission"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginBottom="16dp"
            app:cardBackgroundColor="@color/surface"
            app:cardCornerRadius="@dimen/card_corner_radius"
            app:cardElevation="@dimen/card_elevation">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:padding="16dp">

                <TextView
                    android:id="@+id/tvPermissionTitle"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="@string/card_permission_title"
                    android:textColor="@color/onSurface"
                    android:textSize="16sp"
                    android:textStyle="bold" />

                <TextView
                    android:id="@+id/tvPermissionDesc"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="6dp"
                    android:text="@string/card_permission_desc"
                    android:textColor="@color/textSecondary"
                    android:textSize="13sp" />

                <com.google.android.material.button.MaterialButton
                    android:id="@+id/btnGrantPermission"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="12dp"
                    android:text="@string/btn_grant_permission"
                    app:backgroundTint="@color/primary"
                    app:cornerRadius="10dp" />
            </LinearLayout>
        </com.google.android.material.card.MaterialCardView>

        <!-- Carte 2 : Switch Surveillance Active -->
        <com.google.android.material.card.MaterialCardView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginBottom="16dp"
            app:cardBackgroundColor="@color/surface"
            app:cardCornerRadius="@dimen/card_corner_radius"
            app:cardElevation="@dimen/card_elevation">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:gravity="center_vertical"
                android:orientation="horizontal"
                android:padding="16dp">

                <LinearLayout
                    android:layout_width="0dp"
                    android:layout_height="wrap_content"
                    android:layout_weight="1"
                    android:orientation="vertical">

                    <TextView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="@string/card_service_title"
                        android:textColor="@color/onSurface"
                        android:textSize="16sp"
                        android:textStyle="bold" />

                    <TextView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:layout_marginTop="4dp"
                        android:text="@string/card_service_desc"
                        android:textColor="@color/textSecondary"
                        android:textSize="12sp" />
                </LinearLayout>

                <com.google.android.material.materialswitch.MaterialSwitch
                    android:id="@+id/switchMonitoring"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content" />
            </LinearLayout>
        </com.google.android.material.card.MaterialCardView>

        <!-- Carte 3 : Compteur d'Applications Surveillées -->
        <com.google.android.material.card.MaterialCardView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginBottom="24dp"
            app:cardBackgroundColor="@color/surface"
            app:cardCornerRadius="@dimen/card_corner_radius"
            app:cardElevation="@dimen/card_elevation">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:gravity="center"
                android:orientation="vertical"
                android:padding="20dp">

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="@string/card_counter_title"
                    android:textColor="@color/textSecondary"
                    android:textSize="14sp" />

                <TextView
                    android:id="@+id/tvMonitoredAppsCount"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="6dp"
                    android:text="0"
                    android:textColor="@color/primary"
                    android:textSize="44sp"
                    android:textStyle="bold" />

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="4dp"
                    android:text="@string/card_counter_desc"
                    android:textColor="@color/textSecondary"
                    android:textSize="12sp" />
            </LinearLayout>
        </com.google.android.material.card.MaterialCardView>

    </LinearLayout>
</androidx.core.widget.NestedScrollView>
`
  },
  // 21. app/src/main/res/layout/fragment_history.xml
  {
    path: "app/src/main/res/layout/fragment_history.xml",
    language: "xml",
    description: "Écran d'historique avec SwipeRefreshLayout, RecyclerView et vue vide (empty state).",
    content: `<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/background">

    <!-- En-tête avec Titre et Bouton Vider -->
    <LinearLayout
        android:id="@+id/headerLayout"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="center_vertical"
        android:orientation="horizontal"
        android:paddingHorizontal="16dp"
        android:paddingVertical="12dp"
        app:layout_constraintTop_toTopOf="parent">

        <TextView
            android:id="@+id/tvHistoryTitle"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="@string/history_title"
            android:textColor="@color/onBackground"
            android:textSize="20sp"
            android:textStyle="bold" />

        <com.google.android.material.button.MaterialButton
            android:id="@+id/btnClearHistory"
            style="@style/Widget.Material3.Button.TextButton"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/btn_clear_history"
            android:textColor="@color/error" />
    </LinearLayout>

    <androidx.swiperefreshlayout.widget.SwipeRefreshLayout
        android:id="@+id/swipeRefreshLayout"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintTop_toBottomOf="@id/headerLayout">

        <androidx.recyclerview.widget.RecyclerView
            android:id="@+id/rvHistory"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:clipToPadding="false"
            android:paddingHorizontal="16dp"
            android:paddingTop="8dp"
            android:paddingBottom="80dp" />

    </androidx.swiperefreshlayout.widget.SwipeRefreshLayout>

    <!-- Empty State -->
    <LinearLayout
        android:id="@+id/layoutEmptyState"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:gravity="center"
        android:orientation="vertical"
        android:padding="32dp"
        android:visibility="gone"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@id/headerLayout">

        <ImageView
            android:layout_width="64dp"
            android:layout_height="64dp"
            android:src="@drawable/ic_history"
            app:tint="@color/textSecondary" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp"
            android:text="@string/history_empty"
            android:textColor="@color/onBackground"
            android:textSize="16sp"
            android:textStyle="bold" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="6dp"
            android:gravity="center"
            android:text="@string/history_empty_hint"
            android:textColor="@color/textSecondary"
            android:textSize="13sp" />
    </LinearLayout>

</androidx.constraintlayout.widget.ConstraintLayout>
`
  },
  // 22. app/src/main/res/layout/fragment_settings.xml
  {
    path: "app/src/main/res/layout/fragment_settings.xml",
    language: "xml",
    description: "Écran de paramètres avec informations de l'application et support hotline ExtraTech.",
    content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/background"
    android:orientation="vertical"
    android:padding="16dp">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="12dp"
        android:layout_marginBottom="16dp"
        android:text="@string/settings_title"
        android:textColor="@color/onBackground"
        android:textSize="22sp"
        android:textStyle="bold" />

    <!-- Carte Paramètres de détection -->
    <com.google.android.material.card.MaterialCardView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginBottom="16dp"
        app:cardBackgroundColor="@color/surface"
        app:cardCornerRadius="@dimen/card_corner_radius"
        app:cardElevation="@dimen/card_elevation">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:padding="16dp">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Configuration de détection"
                android:textColor="@color/onSurface"
                android:textSize="16sp"
                android:textStyle="bold" />

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginTop="8dp"
                android:text="@string/settings_interval"
                android:textColor="@color/textSecondary"
                android:textSize="13sp" />

            <View
                android:layout_width="match_parent"
                android:layout_height="1dp"
                android:layout_marginVertical="12dp"
                android:background="@color/surfaceVariant" />

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="@string/settings_max_entries"
                android:textColor="@color/textSecondary"
                android:textSize="13sp" />
        </LinearLayout>
    </com.google.android.material.card.MaterialCardView>

    <!-- Carte Hotline ExtraTech -->
    <com.google.android.material.card.MaterialCardView
        android:id="@+id/cardSupport"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        app:cardBackgroundColor="@color/surface"
        app:cardCornerRadius="@dimen/card_corner_radius"
        app:cardElevation="@dimen/card_elevation">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:gravity="center_vertical"
            android:orientation="horizontal"
            android:padding="16dp">

            <LinearLayout
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_weight="1"
                android:orientation="vertical">

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="@string/settings_support"
                    android:textColor="@color/onSurface"
                    android:textSize="15sp"
                    android:textStyle="bold" />

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="4dp"
                    android:text="@string/settings_support_phone"
                    android:textColor="@color/primary"
                    android:textSize="14sp"
                    android:textStyle="bold" />
            </LinearLayout>

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btnCallSupport"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Appeler"
                app:backgroundTint="@color/secondary"
                app:cornerRadius="8dp" />
        </LinearLayout>
    </com.google.android.material.card.MaterialCardView>

</LinearLayout>
`
  },
  // 23. app/src/main/res/layout/item_app.xml
  {
    path: "app/src/main/res/layout/item_app.xml",
    language: "xml",
    description: "Item RecyclerView pour une application avec icône réelle, nom, package et bouton désinstaller.",
    content: `<?xml version="1.0" encoding="utf-8"?>
<com.google.android.material.card.MaterialCardView
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_marginVertical="6dp"
    app:cardBackgroundColor="@color/surface"
    app:cardCornerRadius="@dimen/card_corner_radius"
    app:cardElevation="2dp"
    app:strokeColor="@color/surfaceVariant"
    app:strokeWidth="1dp">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="center_vertical"
        android:orientation="horizontal"
        android:padding="12dp">

        <!-- Icône réelle de l'application -->
        <ImageView
            android:id="@+id/ivAppIcon"
            android:layout_width="@dimen/app_icon_size"
            android:layout_height="@dimen/app_icon_size"
            android:contentDescription="Icône de l'application"
            android:src="@mipmap/ic_launcher" />

        <!-- Nom, Package et Heure -->
        <LinearLayout
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_marginStart="14dp"
            android:layout_weight="1"
            android:orientation="vertical">

            <TextView
                android:id="@+id/tvAppName"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:ellipsize="end"
                android:maxLines="1"
                android:text="Nom Application"
                android:textColor="@color/onSurface"
                android:textSize="15sp"
                android:textStyle="bold" />

            <TextView
                android:id="@+id/tvPackageName"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginTop="2dp"
                android:ellipsize="middle"
                android:maxLines="1"
                android:text="com.example.package"
                android:textColor="@color/textSecondary"
                android:textSize="12sp" />

            <TextView
                android:id="@+id/tvLastUsed"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginTop="2dp"
                android:text="Aujourd'hui à 14:32"
                android:textColor="@color/primary"
                android:textSize="11sp" />
        </LinearLayout>

        <!-- Bouton Poubelle Rouge pour désinstaller -->
        <ImageButton
            android:id="@+id/btnDelete"
            android:layout_width="44dp"
            android:layout_height="44dp"
            android:background="?attr/selectableItemBackgroundBorderless"
            android:contentDescription="@string/btn_uninstall"
            android:padding="10dp"
            android:src="@drawable/ic_delete" />

    </LinearLayout>
</com.google.android.material.card.MaterialCardView>
`
  },
  // 24. app/src/main/res/menu/bottom_nav_menu.xml
  {
    path: "app/src/main/res/menu/bottom_nav_menu.xml",
    language: "xml",
    description: "Menu de navigation inférieure reliant les 3 fragments.",
    content: `<?xml version="1.0" encoding="utf-8"?>
<menu xmlns:android="http://schemas.android.com/apk/res/android">
    <item
        android:id="@+id/homeFragment"
        android:icon="@drawable/ic_home"
        android:title="@string/nav_home" />

    <item
        android:id="@+id/historyFragment"
        android:icon="@drawable/ic_history"
        android:title="@string/nav_history" />

    <item
        android:id="@+id/settingsFragment"
        android:icon="@drawable/ic_settings"
        android:title="@string/nav_settings" />
</menu>
`
  },
  // 25. app/src/main/res/navigation/nav_graph.xml
  {
    path: "app/src/main/res/navigation/nav_graph.xml",
    language: "xml",
    description: "Graphe de navigation Android avec les 3 destinations natives.",
    content: `<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/nav_graph"
    app:startDestination="@id/homeFragment">

    <fragment
        android:id="@+id/homeFragment"
        android:name="com.example.appwatchclone.HomeFragment"
        android:label="@string/nav_home" />

    <fragment
        android:id="@+id/historyFragment"
        android:name="com.example.appwatchclone.HistoryFragment"
        android:label="@string/nav_history" />

    <fragment
        android:id="@+id/settingsFragment"
        android:name="com.example.appwatchclone.SettingsFragment"
        android:label="@string/nav_settings" />

</navigation>
`
  },
  // 26. MainActivity.kt
  {
    path: "app/src/main/java/com/example/appwatchclone/MainActivity.kt",
    language: "kotlin",
    description: "Activité principale avec ViewBinding, Navigation Component, vérification de permission et Snackbar.",
    content: `package com.example.appwatchclone

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.navigation.NavController
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.setupWithNavController
import com.example.appwatchclone.databinding.ActivityMainBinding
import com.google.android.material.snackbar.Snackbar

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var navController: NavController

    private val notificationPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { /* Permission accordée ou refusée */ }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Configuration de la navigation par Fragments
        val navHostFragment = supportFragmentManager
            .findFragmentById(R.id.nav_host_fragment) as NavHostFragment
        navController = navHostFragment.navController
        binding.bottomNavigation.setupWithNavController(navController)

        // Demande de permission notification sur Android 13+
        requestNotificationPermission()

        // Vérification de la permission d'accès aux statistiques
        checkUsageAccessPermission()
    }

    override fun onResume() {
        super.onResume()
        checkUsageAccessPermission()
    }

    private fun checkUsageAccessPermission() {
        if (!Utils.hasUsagePermission(this)) {
            Snackbar.make(
                binding.root,
                "Accès aux statistiques requis pour surveiller les apps",
                Snackbar.LENGTH_INDEFINITE
            ).setAction("Autoriser") {
                startActivity(Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS))
            }.show()
        }
    }

    private fun requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(
                    this,
                    Manifest.permission.POST_NOTIFICATIONS
                ) != PackageManager.PERMISSION_GRANTED
            ) {
                notificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
            }
        }
    }
}
`
  },
  // 27. HomeFragment.kt
  {
    path: "app/src/main/java/com/example/appwatchclone/HomeFragment.kt",
    language: "kotlin",
    description: "Fragment Accueil gérant la permission, le switch du service foreground et le compteur d'apps.",
    content: `package com.example.appwatchclone

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import com.example.appwatchclone.databinding.FragmentHomeBinding

class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Bouton Autoriser l'accès
        binding.btnGrantPermission.setOnClickListener {
            val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            startActivity(intent)
        }

        // Switch Démarrer / Arrêter la surveillance
        binding.switchMonitoring.setOnCheckedChangeListener { _, isChecked ->
            val context = requireContext()
            val serviceIntent = Intent(context, UsageMonitorService::class.java)

            if (isChecked) {
                ContextCompat.startForegroundService(context, serviceIntent)
            } else {
                context.stopService(serviceIntent)
            }

            val prefs = context.getSharedPreferences("appwatch_prefs", Context.MODE_PRIVATE)
            prefs.edit().putBoolean("is_service_running", isChecked).apply()
        }
    }

    override fun onResume() {
        super.onResume()
        updateUiState()
    }

    private fun updateUiState() {
        val context = context ?: return
        val hasPermission = Utils.hasUsagePermission(context)

        // Mise à jour de la carte permission
        if (hasPermission) {
            binding.tvPermissionTitle.text = getString(R.string.permission_granted)
            binding.tvPermissionDesc.text = "La permission système est active. Les ouvertures d'apps sont détectées."
            binding.btnGrantPermission.visibility = View.GONE
        } else {
            binding.tvPermissionTitle.text = getString(R.string.card_permission_title)
            binding.tvPermissionDesc.text = getString(R.string.card_permission_desc)
            binding.btnGrantPermission.visibility = View.VISIBLE
        }

        // État du switch de surveillance
        val prefs = context.getSharedPreferences("appwatch_prefs", Context.MODE_PRIVATE)
        val isServiceRunning = prefs.getBoolean("is_service_running", false)
        binding.switchMonitoring.isChecked = isServiceRunning

        // Compteur d'applications
        val history = Utils.loadHistory(context)
        binding.tvMonitoredAppsCount.text = history.size.toString()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
`
  },
  // 28. HistoryFragment.kt
  {
    path: "app/src/main/java/com/example/appwatchclone/HistoryFragment.kt",
    language: "kotlin",
    description: "Fragment Historique avec RecyclerView, SwipeRefreshLayout et redirection vers les paramètres d'applications.",
    content: `package com.example.appwatchclone

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.appwatchclone.databinding.FragmentHistoryBinding

class HistoryFragment : Fragment() {

    private var _binding: FragmentHistoryBinding? = null
    private val binding get() = _binding!!
    private lateinit var adapter: HistoryAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHistoryBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        adapter = HistoryAdapter(
            onItemClick = { appInfo ->
                Utils.openAppSettings(requireContext(), appInfo.packageName)
            },
            onDeleteClick = { appInfo ->
                Utils.openAppSettings(requireContext(), appInfo.packageName)
            }
        )

        binding.rvHistory.layoutManager = LinearLayoutManager(requireContext())
        binding.rvHistory.adapter = adapter

        binding.swipeRefreshLayout.setOnRefreshListener {
            loadHistory()
        }

        binding.btnClearHistory.setOnClickListener {
            Utils.clearHistory(requireContext())
            loadHistory()
            Toast.makeText(requireContext(), "Historique vidé", Toast.LENGTH_SHORT).show()
        }

        loadHistory()
    }

    override fun onResume() {
        super.onResume()
        loadHistory()
    }

    private fun loadHistory() {
        val list = Utils.loadHistory(requireContext())
        adapter.submitList(list)
        binding.swipeRefreshLayout.isRefreshing = false

        if (list.isEmpty()) {
            binding.layoutEmptyState.visibility = View.VISIBLE
            binding.rvHistory.visibility = View.GONE
        } else {
            binding.layoutEmptyState.visibility = View.GONE
            binding.rvHistory.visibility = View.VISIBLE
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
`
  },
  // 29. HistoryAdapter.kt
  {
    path: "app/src/main/java/com/example/appwatchclone/HistoryAdapter.kt",
    language: "kotlin",
    description: "Adaptateur RecyclerView avec DiffUtil et gestion du clic pour ouvrir les paramètres système.",
    content: `package com.example.appwatchclone

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.appwatchclone.databinding.ItemAppBinding

class HistoryAdapter(
    private val onItemClick: (AppInfo) -> Unit,
    private val onDeleteClick: (AppInfo) -> Unit
) : ListAdapter<AppInfo, HistoryAdapter.ViewHolder>(DiffCallback) {

    class ViewHolder(val binding: ItemAppBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemAppBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = getItem(position)
        val context = holder.itemView.context

        holder.binding.tvAppName.text = item.appName
        holder.binding.tvPackageName.text = item.packageName
        holder.binding.tvLastUsed.text = Utils.formatTime(item.lastUsed)

        val icon = Utils.getAppIcon(context, item.packageName)
        holder.binding.ivAppIcon.setImageDrawable(icon)

        holder.itemView.setOnClickListener {
            onItemClick(item)
        }

        holder.binding.btnDelete.setOnClickListener {
            onDeleteClick(item)
        }
    }

    companion object DiffCallback : DiffUtil.ItemCallback<AppInfo>() {
        override fun areItemsTheSame(oldItem: AppInfo, newItem: AppInfo): Boolean {
            return oldItem.packageName == newItem.packageName && oldItem.lastUsed == newItem.lastUsed
        }

        override fun areContentsTheSame(oldItem: AppInfo, newItem: AppInfo): Boolean {
            return oldItem == newItem
        }
    }
}
`
  },
  // 30. SettingsFragment.kt
  {
    path: "app/src/main/java/com/example/appwatchclone/SettingsFragment.kt",
    language: "kotlin",
    description: "Fragment Paramètres avec informations techniques et appel direct vers l'assistance.",
    content: `package com.example.appwatchclone

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.example.appwatchclone.databinding.FragmentSettingsBinding

class SettingsFragment : Fragment() {

    private var _binding: FragmentSettingsBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentSettingsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.btnCallSupport.setOnClickListener {
            val dialIntent = Intent(Intent.ACTION_DIAL).apply {
                data = Uri.parse("tel:0661460899")
            }
            startActivity(dialIntent)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
`
  },
  // 31. UsageMonitorService.kt
  {
    path: "app/src/main/java/com/example/appwatchclone/UsageMonitorService.kt",
    language: "kotlin",
    description: "Foreground Service en Kotlin scrutant UsageStatsManager toutes les 5s et stockant en JSON dans SharedPreferences.",
    content: `package com.example.appwatchclone

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import androidx.core.app.NotificationCompat
import org.json.JSONArray
import org.json.JSONObject

class UsageMonitorService : Service() {

    companion object {
        private const val CHANNEL_ID = "appwatch_channel"
        private const val NOTIFICATION_ID = 1001
        private const val INTERVAL_MS = 5000L
        private const val LOOKBACK_WINDOW_MS = 15000L
        private const val ACTION_STOP = "com.example.appwatchclone.ACTION_STOP"
    }

    private val handler = Handler(Looper.getMainLooper())
    private var lastPackage: String? = null

    private val monitorRunnable = object : Runnable {
        override fun run() {
            detectForegroundApp()
            handler.postDelayed(this, INTERVAL_MS)
        }
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        startForeground(NOTIFICATION_ID, buildNotification("Surveillance active"))
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action == ACTION_STOP) {
            val prefs = getSharedPreferences("appwatch_prefs", Context.MODE_PRIVATE)
            prefs.edit().putBoolean("is_service_running", false).apply()
            stopForeground(STOP_FOREGROUND_REMOVE)
            stopSelf()
            return START_NOT_STICKY
        }

        handler.removeCallbacks(monitorRunnable)
        handler.post(monitorRunnable)
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacks(monitorRunnable)
        val prefs = getSharedPreferences("appwatch_prefs", Context.MODE_PRIVATE)
        prefs.edit().putBoolean("is_service_running", false).apply()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun detectForegroundApp() {
        val usageStatsManager = getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager ?: return

        val endTime = System.currentTimeMillis()
        val startTime = endTime - LOOKBACK_WINDOW_MS

        val usageEvents = usageStatsManager.queryEvents(startTime, endTime)
        val event = UsageEvents.Event()
        var resumedPackage: String? = null

        while (usageEvents.hasNextEvent()) {
            usageEvents.getNextEvent(event)
            if (event.eventType == UsageEvents.Event.ACTIVITY_RESUMED) {
                val pkg = event.packageName ?: continue
                if (pkg == packageName || pkg == "com.android.systemui" || pkg == "android") {
                    continue
                }
                resumedPackage = pkg
            }
        }

        if (resumedPackage != null && resumedPackage != lastPackage) {
            lastPackage = resumedPackage
            saveAppToHistory(resumedPackage, endTime)

            val appName = Utils.getAppName(this, resumedPackage)
            val updatedNotif = buildNotification("Dernière app : " + appName)
            val manager = getSystemService(NotificationManager::class.java)
            manager?.notify(NOTIFICATION_ID, updatedNotif)
        }
    }

    private fun saveAppToHistory(pkg: String, timestamp: Long) {
        val prefs = getSharedPreferences("appwatch_prefs", Context.MODE_PRIVATE)
        val jsonString = prefs.getString("apps", "[]") ?: "[]"

        try {
            val jsonArray = JSONArray(jsonString)
            val list = mutableListOf<JSONObject>()

            // Supprimer une entrée existante pour ce package s'il existe déjà
            for (i in 0 until jsonArray.length()) {
                val obj = jsonArray.getJSONObject(i)
                if (obj.optString("pkg") != pkg) {
                    list.add(obj)
                }
            }

            // Insérer la nouvelle au début
            val newEntry = JSONObject().apply {
                put("pkg", pkg)
                put("time", timestamp)
            }
            list.add(0, newEntry)

            // Garder maximum 50 entrées
            val truncated = list.take(50)
            val finalArray = JSONArray()
            for (item in truncated) {
                finalArray.put(item)
            }

            prefs.edit().putString("apps", finalArray.toString()).apply()
        } catch (ignored: Exception) {
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                getString(R.string.notification_channel_name),
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Notification continue pour le service de surveillance"
                setShowBadge(false)
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }
    }

    private fun buildNotification(contentText: String): Notification {
        val openIntent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_SINGLE_TOP
        }
        val openPendingIntent = PendingIntent.getActivity(
            this,
            0,
            openIntent,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0
        )

        val stopIntent = Intent(this, UsageMonitorService::class.java).apply {
            action = ACTION_STOP
        }
        val stopPendingIntent = PendingIntent.getService(
            this,
            1,
            stopIntent,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle(getString(R.string.notification_title))
            .setContentText(contentText)
            .setSmallIcon(android.R.drawable.ic_menu_recent_history)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setContentIntent(openPendingIntent)
            .addAction(android.R.drawable.ic_delete, getString(R.string.notification_stop), stopPendingIntent)
            .build()
    }
}
`
  },
  // 32. AppInfo.kt
  {
    path: "app/src/main/java/com/example/appwatchclone/AppInfo.kt",
    language: "kotlin",
    description: "Data class représentant une application enregistrée dans l'historique.",
    content: `package com.example.appwatchclone

data class AppInfo(
    val packageName: String,
    val appName: String,
    val lastUsed: Long
)
`
  },
  // 33. Utils.kt
  {
    path: "app/src/main/java/com/example/appwatchclone/Utils.kt",
    language: "kotlin",
    description: "Fonctions utilitaires (permissions, icônes réelles, formatage de dates, redirection paramètres).",
    content: `package com.example.appwatchclone

import android.app.AppOpsManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.drawable.Drawable
import android.net.Uri
import android.os.Build
import android.os.Process
import android.provider.Settings
import androidx.core.content.ContextCompat
import org.json.JSONArray
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

object Utils {

    fun hasUsagePermission(context: Context): Boolean {
        val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as? AppOpsManager ?: return false
        val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            appOps.unsafeCheckOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                Process.myUid(),
                context.packageName
            )
        } else {
            @Suppress("DEPRECATION")
            appOps.checkOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                Process.myUid(),
                context.packageName
            )
        }
        return mode == AppOpsManager.MODE_ALLOWED
    }

    fun openAppSettings(context: Context, packageName: String) {
        try {
            val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                data = Uri.parse("package:" + packageName)
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(intent)
        } catch (e: Exception) {
            // Repli si l'intention spécifique échoue
            val fallback = Intent(Settings.ACTION_SETTINGS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(fallback)
        }
    }

    fun getAppName(context: Context, packageName: String): String {
        return try {
            val pm = context.packageManager
            val info = pm.getApplicationInfo(packageName, 0)
            pm.getApplicationLabel(info).toString()
        } catch (e: Exception) {
            packageName
        }
    }

    fun getAppIcon(context: Context, packageName: String): Drawable {
        return try {
            val pm = context.packageManager
            pm.getApplicationIcon(packageName)
        } catch (e: Exception) {
            ContextCompat.getDrawable(context, android.R.drawable.sym_def_app_icon)!!
        }
    }

    fun formatTime(timestamp: Long): String {
        val sdf = SimpleDateFormat("HH:mm:ss - dd/MM/yyyy", Locale.getDefault())
        return sdf.format(Date(timestamp))
    }

    fun loadHistory(context: Context): List<AppInfo> {
        val prefs = context.getSharedPreferences("appwatch_prefs", Context.MODE_PRIVATE)
        val jsonString = prefs.getString("apps", "[]") ?: "[]"
        val result = mutableListOf<AppInfo>()

        try {
            val array = JSONArray(jsonString)
            for (i in 0 until array.length()) {
                val obj = array.getJSONObject(i)
                val pkg = obj.optString("pkg")
                val time = obj.optLong("time")
                if (pkg.isNotEmpty()) {
                    val name = getAppName(context, pkg)
                    result.add(AppInfo(packageName = pkg, appName = name, lastUsed = time))
                }
            }
        } catch (ignored: Exception) {
        }

        return result
    }

    fun clearHistory(context: Context) {
        val prefs = context.getSharedPreferences("appwatch_prefs", Context.MODE_PRIVATE)
        prefs.edit().remove("apps").apply()
    }
}
`
  }
];
