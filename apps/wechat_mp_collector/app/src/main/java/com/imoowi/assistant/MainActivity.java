package com.imoowi.assistant;

import android.app.KeyguardManager;
import android.content.Context;
import android.content.Intent;
import android.os.PowerManager;
import android.provider.Settings;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

public class MainActivity extends AppCompatActivity {
    /**
     * 获取PowerManager.WakeLock对象
     */
    private PowerManager.WakeLock wakeLock;
    /**
     * KeyguardManager.KeyguardLock对象
     */
    private KeyguardManager.KeyguardLock keyguardLock;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        String apkRoot="chmod 777 "+getPackageCodePath();
        SystemManager.RootCommand(apkRoot);
        Intent intent = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS);
        startActivity(intent);
    }
}
