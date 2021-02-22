package com.imoowi.assistant;

import android.accessibilityservice.AccessibilityService;
import android.annotation.TargetApi;
import android.app.ActivityManager;
import android.app.Instrumentation;
import android.app.KeyguardManager;
import android.app.ProgressDialog;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.icu.util.Output;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.PowerManager;
import android.support.v7.app.AlertDialog;
import android.text.format.Formatter;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.io.OutputStream;
import java.io.DataOutputStream;

import android.graphics.Rect;
import android.widget.Toast;

import static android.content.ContentValues.TAG;

import com.loopj.android.http.*;

import org.json.JSONException;
import org.json.JSONObject;

import cz.msebera.android.httpclient.Header;

public class MyAccessibilityService extends AccessibilityService {

    private String objFrom;
    private String objTo;
    private Integer totalMpItems;
    private Integer curMpItemIndex;
    private String curMpName;
    public AsyncHttpClient client;
    public PersistentCookieStore myCookieStore;
    private String last_apr_str;
    private Boolean isWechatDisplay;
    private String lastUrl;
    public Boolean isServiceMP;
    public Boolean isDoingMpServiceClick;
    public Boolean isRecentDialogShow;
    private boolean isScreenOn;
    /**
     * 获取PowerManager.WakeLock对象
     */
    private PowerManager.WakeLock wakeLock;
    /**
     * KeyguardManager.KeyguardLock对象
     */
    private KeyguardManager.KeyguardLock keyguardLock;

    /**
     * 当启动服务的时候就会被调用
     */
    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();
        last_apr_str = "";
        objFrom = "";
        totalMpItems = 0;
        curMpItemIndex = 0;
        curMpName = "";
        isWechatDisplay = false;
        client = new AsyncHttpClient();
        myCookieStore = new PersistentCookieStore(this);
        client.setCookieStore(myCookieStore);
        lastUrl = "";
        isServiceMP = false;//不是服务号，就是订阅号
        isDoingMpServiceClick = false;//是否正在点击服务号列表
        isRecentDialogShow = false;
        //*
        //获取剪切板数据
        final ClipboardManager cm = (ClipboardManager) getSystemService(CLIPBOARD_SERVICE);
        cm.addPrimaryClipChangedListener(new ClipboardManager.OnPrimaryClipChangedListener() {
            @Override
            public void onPrimaryClipChanged() {
                ClipboardManager clipboardManager =
                        (ClipboardManager) getSystemService(CLIPBOARD_SERVICE);
                ClipData data = clipboardManager.getPrimaryClip();
                final String str = data.getItemAt(0).getText().toString();
                if (!lastUrl.equals(str)) {
                    lastUrl = str;
                    //将链接发送到服务器
                    if (str.contains("mp.weixin.qq.com")) {
                        Log.e("Rebot.clipboard", str);
                        final String sendStr = str;
                        RequestParams params = new RequestParams();
                        params.put("url", str);
                        client.post("http://cangweige.imoowi.com/app/add", params, new AsyncHttpResponseHandler() {
                            @Override
                            public void onSuccess(int statusCode, Header[] headers, byte[] responseBody) {
                                if (statusCode == 200) {
                                    Log.e("upload2cloud", str);
                                }
                            }

                            @Override
                            public void onFailure(int statusCode, Header[] headers, byte[] responseBody, Throwable error) {
                                Log.e("statusCode", statusCode + "");
                            }
                        });
                    }

                }
            }
        });
        restartWechat();
    }

    private void restartWechat() {
        if (!isWechatDisplay) {
            startWechat();
        }
        /*
        Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                restartWechat();
            }
        }, 30000);
        //*/
    }

    private void startWechat() {
        if (!isScreenOn()){
            wakeUpScreen();
        }
        objFrom = "Launcher";
        isWechatDisplay = true;
        last_apr_str = "";
        totalMpItems = 0;
        curMpItemIndex = 0;
        curMpName = "";
        isServiceMP = false;//不是服务号，就是订阅号
        isDoingMpServiceClick = false;//是否正在点击服务号列表
        isRecentDialogShow = false;

        Intent intent = new Intent();
        ComponentName cmp = new ComponentName("com.tencent.mm", "com.tencent.mm.ui.LauncherUI");
//        ComponentName cmp = new ComponentName("com.tencent.mm", "com.tencent.mm.plugin.webview.ui.tools.fts.FTSSearchTabWebViewUI");
        intent.setAction(Intent.ACTION_MAIN);
        intent.addCategory(Intent.CATEGORY_LAUNCHER);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.setComponent(cmp);
        startActivity(intent);
    }

    private void startFTSSearch() {
        Intent intent = new Intent();
//        ComponentName cmp = new ComponentName("com.tencent.mm", "com.tencent.mm.ui.LauncherUI");
        ComponentName cmp = new ComponentName("com.tencent.mm", "com.tencent.mm.plugin.webview.ui.tools.fts.FTSSearchTabWebViewUI");
        intent.setAction(Intent.ACTION_MAIN);
        intent.addCategory(Intent.CATEGORY_LAUNCHER);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.setComponent(cmp);
        startActivity(intent);
    }

    private void closeWechat() {
        objFrom = "null";
        last_apr_str = "";
//        performGlobalAction(AccessibilityService.GLOBAL_ACTION_HOME);
        if (!isRecentDialogShow) {
            performGlobalAction(AccessibilityService.GLOBAL_ACTION_RECENTS);
        }
        isRecentDialogShow = true;
        /*
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                startWechat();
            }
        },15000);
        //*/
    }

    private void chkGetLocationUI() {

        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                AccessibilityNodeInfo rootNode = getRootInActiveWindow();
                List<AccessibilityNodeInfo> needInstall = rootNode.findAccessibilityNodeInfosByText("提示");
                if (needInstall.size() >0){
                    for (AccessibilityNodeInfo item : needInstall) {
                        if (item != null) {
                            Log.e("Rebot,install.size", needInstall.size() + "");
                            List<AccessibilityNodeInfo> cancleInstall = rootNode.findAccessibilityNodeInfosByText("取消");
                            for (AccessibilityNodeInfo it : cancleInstall) {
                                if (it != null) {
    //                            performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                                    it.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                                    objFrom = "mpdetail-cancle-get-location";
                                }
                            }
                        }
                    }
                }else{
                    performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                    objFrom = "mpdetail-back";
                }
            }
        }, 50);
    }


    private void chkInstallUI() {

        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                try {

                    AccessibilityNodeInfo rootNode = getRootInActiveWindow();
                    List<AccessibilityNodeInfo> needInstall = rootNode.findAccessibilityNodeInfosByText("立刻安装");
                    if (needInstall.size()>0){
                        for (AccessibilityNodeInfo item : needInstall) {
                            if (item != null) {
                                Log.e("Rebot,install.size", needInstall.size() + "");
                                List<AccessibilityNodeInfo> cancleInstall = rootNode.findAccessibilityNodeInfosByText("取消");
                                boolean hasInstallDialog = false;
                                for (AccessibilityNodeInfo it : cancleInstall) {
                                    if (it != null) {
//                            performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                                        it.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                                        objFrom = "cancle-install-new-apk";
                                        hasInstallDialog = true;
                                    }
                                }
                                if (!hasInstallDialog){
                                    isDoingMpServiceClick = false;
                                    doMpServiceClick();
                                }
                            }
                        }
                    }else{
                        isDoingMpServiceClick = false;
                        doMpServiceClick();
                    }
                }catch (Exception e){
                    closeWechat();
                }
            }
        }, 5);
    }
    private Boolean chkJungeMsg(){
//        return false;
        //*
        Log.e("Rebot,chkJungeMsg","1");
        final AccessibilityNodeInfo rootNode = getRootInActiveWindow();
        List<AccessibilityNodeInfo> list = rootNode.findAccessibilityNodeInfosByViewId("com.tencent.mm:id/hj");
        if (list.size()>0){
            Log.e("Rebot,chkJungeMsg","2");
            for (AccessibilityNodeInfo item:list){
                String mp_title = item.getText().toString();
                Log.e("Rebot,chkJungeMsg","3");
                if (mp_title.equals("君哥")){
                    Log.e("Rebot,chkJungeMsg","4");
                    new Handler().postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            Log.e("Rebot,chkJungeMsg","5");
                            List<AccessibilityNodeInfo> list1 = rootNode.findAccessibilityNodeInfosByViewId("com.tencent.mm:id/aep"); //公众号
                            if (list1.size()>0){
                                Log.e("Rebot,chkJungeMsg","6");
                                AccessibilityNodeInfo lastOne = list1.get(list1.size()-1);
                                if (lastOne != null){
                                    Log.e("Rebot,chkJungeMsg","7");
                                    lastOne.getParent().performAction(AccessibilityNodeInfo.ACTION_CLICK);
                                    objFrom = "addMpClicked";
                                }
                            }
                        }
                    }, 1000);
                    return true;
                }

            }
        }
        return false;
        //*/
    }
    private void doMpDetailClick() {

        new Handler().postDelayed(new Runnable() {
            public void run() {
                try {
                    //检测君哥发来的消息
                    if (chkJungeMsg()){
                        return;
                    }
                    AccessibilityNodeInfo rootNode = getRootInActiveWindow();
                    List<AccessibilityNodeInfo> list = rootNode.findAccessibilityNodeInfosByViewId("com.tencent.mm:id/ab3");
                    if (list.size() > 0) {
                        AccessibilityNodeInfo lastOne = list.get(list.size() - 1);
                        if (lastOne.getChildCount() > 0) {
                            totalMpItems = lastOne.getChildCount();
                            if (lastOne.isClickable()) {
                                lastOne.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                                curMpItemIndex++;
                                objFrom = "mpdetail-clicked";
                            } else {
                                performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                                objFrom = "mpdetail-back";
                            }
                        } else {
                            performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                            objFrom = "mpdetail-back";
                        }
                    } else {
                        chkGetLocationUI();
//                            performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
//                            objFrom = "mpdetail-back";
                    }
                }catch (Exception e){
                    performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                    objFrom = "mpdetail-back";
                }
            }
        }, 5000);
    }
    private void doMpFollowAction(){
        Log.e("Rebot,dompfollowaction","1");
        objFrom = "";
        final AccessibilityNodeInfo rootNode = getRootInActiveWindow();
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                Log.e("Rebot,dompfollowaction","2");
//                List<AccessibilityNodeInfo> list = rootNode.findAccessibilityNodeInfosByText("关注");
                List<AccessibilityNodeInfo> list = rootNode.findAccessibilityNodeInfosByViewId("android:id/title");
                if (list.size()>0){
                    Log.e("Rebot,dompfollowaction","3");
                    for (AccessibilityNodeInfo item:list){
                        Log.e("Rebot,dompfollowaction","4");
                        CharSequence title = item.getText();
                        if (title != null){
                            Log.e("Rebot,dompfollowaction","5");
                            if (title.toString().equals("关注")){
                                Log.e("Rebot,dompfollowaction","6");
                                item.getParent().performAction(AccessibilityNodeInfo.ACTION_CLICK);

                                new Handler().postDelayed(new Runnable() {
                                    @Override
                                    public void run() {
                                        AccessibilityNodeInfo rootNode1 = getRootInActiveWindow();
                                        List<AccessibilityNodeInfo> needInstall = rootNode1.findAccessibilityNodeInfosByText("提示");
                                        if (needInstall.size() >0){
                                            for (AccessibilityNodeInfo item : needInstall) {
                                                if (item != null) {
                                                    Log.e("Rebot,install.size", needInstall.size() + "");
                                                    List<AccessibilityNodeInfo> cancleInstall = rootNode1.findAccessibilityNodeInfosByText("取消");
                                                    for (AccessibilityNodeInfo it : cancleInstall) {
                                                        if (it != null) {
                                                            //                            performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                                                            it.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                                                            performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                                                            objFrom="followMpBack";
                                                        }
                                                    }
                                                }
                                            }
                                        }else{
                                            performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                                            objFrom="followMpBack";
                                        }
                                    }
                                }, 5000);
                                /*
                                new Handler().postDelayed(new Runnable() {
                                    @Override
                                    public void run() {
                                        Log.e("Rebot,dompfollowaction","7");
                                        performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                                        objFrom="mpFollowed";
                                    }
                                },1000);
                                //*/
                                break;
                            }
                        }
                    }
                }
                /*
                if (list.size()>0){
                    Log.e("Rebot,dompfollowaction","3");
                    for (AccessibilityNodeInfo item:list){
                        item.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                        new Handler().postDelayed(new Runnable() {
                            @Override
                            public void run() {
                                performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                            }
                        },1000);
                    }
                    return;
                }
                //*/
                list = rootNode.findAccessibilityNodeInfosByText("进入公众号");
                if (list.size()>0){
                    Log.e("Rebot,dompfollowaction","4");
                    performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                    objFrom="doFollowMpBack";
                    return;
                }
                Log.e("Rebot,dompfollowaction","5");
                list = rootNode.findAccessibilityNodeInfosByViewId("android:id/list");
                if (list.size()>0){
                    for (AccessibilityNodeInfo item:list){
                        Log.e("Rebot,dompfollowaction","6");
                        item.performAction(AccessibilityNodeInfo.ACTION_SCROLL_FORWARD);
                        objFrom = "followMpScroll";
                    }
                }else{
                    Log.e("Rebot,dompfollowaction","7");
                    performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                    objFrom = "";
                }
            }
        },1000);
    }
    private void clearRecentProgress() {
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                AccessibilityNodeInfo rootNode = getRootInActiveWindow();
                List<AccessibilityNodeInfo> list = rootNode.findAccessibilityNodeInfosByViewId("com.android.systemui:id/recents_clear_button_layout");
                if (list.size()>0){
                    for (AccessibilityNodeInfo item : list) {
                        item.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                    }
                    isWechatDisplay = false;
                    isRecentDialogShow = false;
                    lockScreen();
                    //*
                    new Handler().postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            startWechat();
                        }
                    },15000);
                    //*/
                }
            }
        }, 1000);
    }

    private void setKeyPress(int keycode) {
        try {
            String keyCommand = "input keyevent " + keycode;
            Runtime runtime = Runtime.getRuntime();
            Process process = runtime.exec(keyCommand);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void execShellCmd(String cmd) {
        try {
            Process process = Runtime.getRuntime().exec("su");
            OutputStream outputStream = process.getOutputStream();
            DataOutputStream dataOutputStream = new DataOutputStream(outputStream);
            dataOutputStream.writeBytes(cmd);
            dataOutputStream.flush();
            dataOutputStream.close();
            outputStream.close();
        } catch (Throwable t) {
            t.printStackTrace();
        }
    }

    private void receiveSystemUIEvent(String className) {
        if (className.equals("com.android.systemui.recents.RecentsActivity")) {
            clearRecentProgress();
            return;
        }
        if (className.equals("android.widget.ImageView")) {
            clearRecentProgress();
        }
    }

    private void receiveWechatEvent(String className) {
        Log.e("objFrom=", objFrom);
        final AccessibilityNodeInfo rootNode = getRootInActiveWindow();
        if (className.equals("com.tencent.mm.app.WeChatSplashActivity")) {//启动页面
            objFrom = "Launcher";
            isWechatDisplay = true;
//            doMpServiceClick();
//            return;
        }
        if (className.equals("com.tencent.mm.ui.base.i")) {//是否取消安装对话框
            if (objFrom.equals("cancle-install-new-apk")) {
                new Handler().postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        AccessibilityNodeInfo rootNode = getRootInActiveWindow();
                        List<AccessibilityNodeInfo> list = rootNode.findAccessibilityNodeInfosByText("是否取消安装？");
                        for (AccessibilityNodeInfo item : list) {
                            if (item != null) {
                                Log.e("Rebot,cancle-install-new-apk-list.size", list.size() + "");
                                List<AccessibilityNodeInfo> list1 = rootNode.findAccessibilityNodeInfosByText("是");
                                for (AccessibilityNodeInfo it : list1) {
                                    if (it != null) {
                                        it.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                                        objFrom = "install-new-apk-cancled";
                                    }
                                }
                            }
                        }
                    }
                }, 1000);
            }
        }
        if (className.equals("com.tencent.mm.sandbox.updater.AppInstallerUI")) {//检测是否有安装界面
            chkInstallUI();
        }
        if (className.equals("com.tencent.mm.ui.LauncherUI")) { //微信首页
            Log.e("Rebot,objFrom:", objFrom);
            /*
            List<AccessibilityNodeInfo> addBtn = rootNode.findAccessibilityNodeInfosByViewId("com.tencent.mm:id/g_");
            Log.e("Rebot, addBtn.size=", addBtn.size()+"");
            for (AccessibilityNodeInfo item:addBtn){
                item.getParent().performAction(AccessibilityNodeInfo.ACTION_CLICK);
                objFrom = "addFriendBtnClicked";
            }
            //*/

            if (objFrom.equals("Launcher")){
                new Handler().postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        chkInstallUI();
                    }
                },10000);
            }
            if (objFrom.equals("mplist-back")) {
//                closeWechat();
                objFrom = "null";
                isDoingMpServiceClick = false;
                doMpServiceClick();
            }
//            objFrom = "add-contact-end";
            if (objFrom.equals("add-contact-end") || objFrom.equals("install-new-apk-cancled")) {
                doMpHomeClick();
            }
        }

        if (className.equals("android.widget.FrameLayout")) {
            if (objFrom.equals("addFriendBtnClicked")) { //添加朋友按钮
                objFrom = "null";
                new Handler().postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        List<AccessibilityNodeInfo> addBtn = rootNode.findAccessibilityNodeInfosByViewId("com.tencent.mm:id/i3");
                        Log.e("Rebot,addBtn2.size=", addBtn.size() + "");
                        if (addBtn.size() > 0) {
                            AccessibilityNodeInfo secondOne = addBtn.get(1);
                            if (secondOne != null) {
                                secondOne.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                                objFrom = "addFriendBtnClicked2";
                            }
                        } else {
                            performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                            objFrom = "Launcher";
                        }
                    }
                }, 1000);

            }
            if (objFrom.equals("mpservicelist") || objFrom.equals("mpservicelist-scroll")){
                objFrom="null";
                doMpDetailClick();
            }
        }
        if (className.equals("com.tencent.mm.plugin.subapp.ui.pluginapp.AddMoreFriendsUI")) { //添加朋友
            if (objFrom.equals("addFriendBtnClicked2")) {//点击公众号
                objFrom = "null";
                new Handler().postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        List<AccessibilityNodeInfo> list = rootNode.findAccessibilityNodeInfosByViewId("android:id/list");
                        for (AccessibilityNodeInfo item : list) {
                            AccessibilityNodeInfo eightOne = item.getChild(8);
                            if (eightOne != null) {
                                eightOne.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                                objFrom = "addFriendMpBtnClicked";
                            } else {
                                performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                            }
                        }
                    }
                }, 1000);
            }
        }
        if (className.equals("com.tencent.mm.plugin.webview.ui.tools.fts.FTSSearchTabWebViewUI")) {//搜索公众号
            if (objFrom.equals("addFriendMpBtnClicked")) {
                new Handler().postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        List<AccessibilityNodeInfo> list = rootNode.findAccessibilityNodeInfosByViewId("com.tencent.mm:id/ht");
                        for (AccessibilityNodeInfo item : list) {
//                            item.performAction(AccessibilityNodeInfo.ACTION_PASTE);
                            Bundle arguments = new Bundle();
                            arguments.putCharSequence(AccessibilityNodeInfo.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE, "orthonline");
                            item.performAction(AccessibilityNodeInfo.ACTION_SET_TEXT, arguments);
                            objFrom = "addFriend-set-mp-no";
                            setKeyPress(29);
                            //*
                            new Handler().postDelayed(new Runnable() {
                                @Override
                                public void run() {//执行搜索操作
                                    execShellCmd("input keyevent 84");
//                                    setKeyPress(84);
//                                    performGlobalAction(AccessibilityService.SoftKeyboardController.OnShowModeChangedListener)
//                                    AccessibilityNodeInfo keyboard = AccessibilityService.SoftKeyboardController;
//                                    keyboard.performAction(AccessibilityService.SEARCH_SERVICE);//????
                                }
                            }, 1000);
                            //*/
                        }
                    }
                }, 1000);
            }
        }
        if (className.equals("com.tencent.mm.plugin.profile.ui.ContactInfoUI")) {//公众号详情页
            if (objFrom.equals("addMpClicked")){//添加公众号
                doMpFollowAction();
            }
            if (objFrom.equals("followMpBack")){
                performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                objFrom="doFollowMpBack";
            }
        }
        if (className.equals("com.tencent.mm.ui.conversation.BizConversationUI")) { //公众号列表页
            Log.e("Rebot,BizConversationUI,objFrom:", objFrom);
            if (objFrom.equals("home")) {
                objFrom = "null";
                doMpListClick();
                    /*
                    new Handler().postDelayed(new Runnable() {
                        public void run() {
                            doMpListClick();
                        }
                    }, 5000);
                    //*/
            }
            if (objFrom.equals("mpdetail-back")) {
                objFrom = "null";
                if (isServiceMP){
                    performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                    new Handler().postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            doMpServiceClick();;
                        }
                    },500);
                }else {
                    doMpListClick();
                }
            }
            if (className.equals("browser")) {
                doMpListClick();
            }
            if (className.equals("browser-back")) {

//                    inputClick("com.tencent.mm:id/hh");
//                    objFrom = "mpdetail-back";
//                    objFrom = "mplist-scroll";
                doMpListClick();
            }
            if (objFrom.equals("mplist-scroll")) {
                doMpListClick();
            }
        }
        if (className.equals("android.widget.ListView")) {//在微信公众号列表和详情页中
            Log.e("Rebot,objFrom:", objFrom);

            if (objFrom.equals("doFollowMpBack")){
                objFrom="";
                performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                new Handler().postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        objFrom="";
                        isDoingMpServiceClick = false;
                        doMpServiceClick();
                    }
                },2000);
            }
            if (objFrom.equals("followMpScroll")){
                doMpFollowAction();
            }
            if (objFrom.equals("mplist-scroll")) {
                doMpListClick();
            }
            if (objFrom.equals("mpservicelist-scroll")){
                isDoingMpServiceClick = false;
                doMpServiceClick();
            }
            if (objFrom.equals("mplist") ||objFrom.equals("mpservicelist") || objFrom.equals("mpdetail-cancle-get-location")) {//来自公众号列表/浏览器，进入公众号详情页面
                Log.e("Rebot,curMpItemIndex=", curMpItemIndex + "");
                Log.e("Rebot,totalMpItems=", (totalMpItems) + "");
                objFrom = "null";
                doMpDetailClick();
            }
/*
            if (objFrom.equals("mpdetail-back")) {
                objFrom = "null-long-click";
                doMpListClick();
            }
//*/
            if (objFrom.equals("mpdetail-back")) {
                objFrom = "null";
                if (isServiceMP){
                    isDoingMpServiceClick = false;
                    doMpServiceClick();
                }else {
                    doMpListClick();
                }
            }
            if (objFrom.equals("browser-back")) {//来自浏览器
                objFrom = "null";
                new Handler().postDelayed(new Runnable() {
                    public void run() {
                        AccessibilityNodeInfo rootNode = getRootInActiveWindow();
                        List<AccessibilityNodeInfo> list = rootNode.findAccessibilityNodeInfosByViewId("com.tencent.mm:id/ab3");
                        if (list.size() > 0) {
                            Log.e("browser-back,,totalMpItems=", totalMpItems + "");
                            Log.e("browser-back,,curMpItemIndex=", curMpItemIndex + "");
                            if (totalMpItems > curMpItemIndex) {
                                AccessibilityNodeInfo lastOne = list.get(list.size() - 1);
                                AccessibilityNodeInfo mpDetailItem = lastOne.getChild(curMpItemIndex);
                                if (mpDetailItem != null) {
                                    if (mpDetailItem.isClickable()) {
                                        mpDetailItem.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                                        objFrom = "mpdetail-clicked";
                                        curMpItemIndex++;
                                    } else {
                                        performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                                        objFrom = "mpdetail-back";
                                    }
                                } else {
                                    performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                                    objFrom = "mpdetail-back";
                                }
                            } else {
                                performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                                objFrom = "mpdetail-back";
                            }
                        }
                    }
                }, 500);
            }
                /*
                if (objFrom.equals("mplist-scroll-null---null")){
                    performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                    objFrom = "mplist-back";
                }
                //*/
            if (objFrom.equals("mplist-back")) {
//                closeWechat();
                performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                objFrom = "null";
                new Handler().postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        isDoingMpServiceClick = false;
                        doMpServiceClick();
                    }
                },1000);
            }
        }
        if (className.equals("com.tencent.mm.plugin.webview.ui.tools.WebViewUI")) {//在微信浏览器中
            Log.e("Rebot,objFrom:", objFrom);
            if (objFrom.equals("mpdetail-clicked")) {
                objFrom = "null";
                new Handler().postDelayed(new Runnable() {
                    public void run() {

                        inputClick("com.tencent.mm:id/he");
//                        performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                        objFrom = "browser";
                    }
                }, 5000);

            }

            if (objFrom.equals("browserMore")) {
                objFrom = "null";
                    /*
                    new Handler().postDelayed(new Runnable() {
                        public void run() {
                            if (canCloseWebBrowser == 1) {
//                            inputClick("com.tencent.mm:id/hx");
                                performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                                objFrom = "browser-back";
                            }
                        }
                    }, 5);
                    //*/
                performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                objFrom = "browser-back";
            }
            if (objFrom.equals("browser-back")) {
//                inputClick("com.tencent.mm:id/hx");
                performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                objFrom = "browser-back";
            }
        }
        if (className.equals("android.support.design.widget.c")) {//微信浏览器更多界面
            Log.e("Rebot,objFrom:", objFrom);
            objFrom = "null";
            /*
            new Handler().postDelayed(new Runnable() {

                public void run() {
                    objFrom = "browserMore";
                    browserMoreChildrenClick("com.tencent.mm:id/c_v", "复制链接");
                    canCloseWebBrowser = 0;
                }

            }, 0);
            //*/
            browserMoreChildrenClick("com.tencent.mm:id/c_v", "复制链接");

        }
        //*
        if (className.equals("android.widget.Toast$TN")) {
            Log.e("Rebot,objFrom:", objFrom);
//            objFrom = "null";
            objFrom = "browser-back";
            performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
        }
    }


    /**
     * 监听窗口变化的回调
     */
    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        String packageName = event.getPackageName().toString();
        Log.e("Rebot.packageName", packageName);
        String className = event.getClassName().toString();
        Log.e("Rebot.className", className);
        //*
        switch (packageName) {
            case "com.android.systemui":
                receiveSystemUIEvent(className);
                break;
            case "com.tencent.mm":
                receiveWechatEvent(className);
                break;
        }
        //*/
    }
    private void doMpHomeClick(){
        objFrom = "null";
        new Handler().postDelayed(new Runnable() {
            public void run() {
                try {
                    AccessibilityNodeInfo rootNode = getRootInActiveWindow();
                    List<AccessibilityNodeInfo> list = rootNode.findAccessibilityNodeInfosByViewId("com.tencent.mm:id/app");
                    if (list.size() > 0) {
                        List<AccessibilityNodeInfo> apr = rootNode.findAccessibilityNodeInfosByViewId("com.tencent.mm:id/apr");
                        int i = 0;
                        Boolean hasMp = false;
                        for (AccessibilityNodeInfo item : apr) {
                            if (("订阅号").equals(item.getText().toString())) {
                                AccessibilityNodeInfo firstOne = list.get(i);

                                objFrom = "home";
                                firstOne.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                                hasMp = true;
                                break;
                            }
                            i++;
                        }
                        if (!hasMp) {
                            chkInstallUI();
                        }

                    } else {
                        chkInstallUI();
                    }
                } catch (Exception e) {
                    closeWechat();
                }
            }
        }, 1000);
    }
    //订阅号列表点击
    private void doMpListClick() {

        curMpItemIndex = 0;
        totalMpItems = 0;
        isServiceMP = false;
        AccessibilityNodeInfo rootNode = getRootInActiveWindow();
        if (rootNode != null) {
            List<AccessibilityNodeInfo> list = rootNode.findAccessibilityNodeInfosByViewId("com.tencent.mm:id/apq");
//        List<AccessibilityNodeInfo> list = rootNode.findAccessibilityNodeInfosByViewId("com.tencent.mm:id/app");
            Log.e("Rebot,mplist.size=", list.size() + "");
            objFrom = "mplist-scroll-null---null";
            if (list.size() > 0) {
                for (AccessibilityNodeInfo item : list) {
                    item.getParent().performAction(AccessibilityNodeInfo.ACTION_CLICK);
//                item.performAction(AccessibilityNodeInfo.ACTION_CLICK);
                    objFrom = "mplist";
                }
            } else {
                List<AccessibilityNodeInfo> list1 = rootNode.findAccessibilityNodeInfosByViewId("com.tencent.mm:id/ayf");
                for (AccessibilityNodeInfo item : list1) {
                    final AccessibilityNodeInfo it = item;
                    List<AccessibilityNodeInfo> apr = rootNode.findAccessibilityNodeInfosByViewId("com.tencent.mm:id/apr");
                    Log.e("apr.size=", apr.size() + "");
                    if (apr.size() > 0) {
                        final AccessibilityNodeInfo first_apr = apr.get(0);
                        final AccessibilityNodeInfo last_apr = apr.get(apr.size() - 1);
                        Log.e("first_apr_str=", first_apr.getText().toString());
                        Log.e("last_apr_str=", last_apr.getText().toString());
                        objFrom = "mplist-scroll";
                        if (last_apr_str.equals(last_apr.getText().toString())) {
                            objFrom = "null";
                            performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                            objFrom = "mplist-back";
//                        last_apr_str = "";
                        } else {

                            it.performAction(AccessibilityNodeInfo.ACTION_SCROLL_FORWARD);
                        }
                        last_apr_str = last_apr.getText().toString();
                    }else{
                        performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK);
                    }
                }
            }
        }
    }
    //首页服务号列表点击
    private void doMpServiceClick(){
        Log.e("Rebot,dompserviceclick","haha");

//        objFrom="null";
        //*
        if (isDoingMpServiceClick){
            return;
        }
        isDoingMpServiceClick = true;


        curMpItemIndex = 0;
        totalMpItems = 0;
        isServiceMP = true;
        AccessibilityNodeInfo rootNode = getRootInActiveWindow();
        if (rootNode != null) {
            List<AccessibilityNodeInfo> apqfirst = rootNode.findAccessibilityNodeInfosByViewId("com.tencent.mm:id/apq");
            //*
            if (apqfirst.size()>0){
                doMpHomeClick();
                return;
            }
            //*/
            List<AccessibilityNodeInfo> list = rootNode.findAccessibilityNodeInfosByViewId("com.tencent.mm:id/j4");//logo上的红点
            Log.e("Rebot,mpservicelist.size=", list.size() + "");

            if (list.size() > 0) {
                for (AccessibilityNodeInfo item : list) {
                    item.getParent().performAction(AccessibilityNodeInfo.ACTION_CLICK);
                    objFrom = "mpservicelist";
                }
            } else {
                List<AccessibilityNodeInfo> list1 = rootNode.findAccessibilityNodeInfosByViewId("com.tencent.mm:id/c5q");//ListView的id
                if (list1.size()>0){
                    for (AccessibilityNodeInfo item : list1) {
                        final AccessibilityNodeInfo it = item;
                        List<AccessibilityNodeInfo> apr = rootNode.findAccessibilityNodeInfosByViewId("com.tencent.mm:id/apr");//名字
                        Log.e("apr.size=", apr.size() + "");
                        if (apr.size() > 0) {
                            final AccessibilityNodeInfo first_apr = apr.get(0);
                            final AccessibilityNodeInfo last_apr = apr.get(apr.size() - 1);
                            Log.e("first_apr_str=", first_apr.getText().toString());
                            Log.e("last_apr_str=", last_apr.getText().toString());
                            objFrom = "mpservicelist-scroll";
                            if (last_apr_str.equals(last_apr.getText().toString())) {
                                objFrom = "null";
//                                        performGlobalAction(AccessibilityService.GLOBAL_ACTION_RECENTS);
                                closeWechat();
                            } else {
//                                        objFrom = "mpservicelist-scroll";
                                it.performAction(AccessibilityNodeInfo.ACTION_SCROLL_FORWARD);
                            }
                            last_apr_str = last_apr.getText().toString();
                        }else{
                            objFrom = "null";
//                                    performGlobalAction(AccessibilityService.GLOBAL_ACTION_RECENTS);
                            closeWechat();
                        }
                    }
                }else{
                    closeWechat();
                }
            }
        }else {
            closeWechat();
        }
        /*
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {

                curMpItemIndex = 0;
                totalMpItems = 0;
                isServiceMP = true;
                AccessibilityNodeInfo rootNode = getRootInActiveWindow();
                if (rootNode != null) {
                    List<AccessibilityNodeInfo> apqfirst = rootNode.findAccessibilityNodeInfosByViewId("com.tencent.mm:id/apq");
                    if (apqfirst.size()>0){
                        doMpHomeClick();
                        return;
                    }
                    List<AccessibilityNodeInfo> list = rootNode.findAccessibilityNodeInfosByViewId("com.tencent.mm:id/j4");//logo上的红点
                    Log.e("Rebot,mpservicelist.size=", list.size() + "");

                    if (list.size() > 0) {
                        for (AccessibilityNodeInfo item : list) {
                            item.getParent().performAction(AccessibilityNodeInfo.ACTION_CLICK);
                            objFrom = "mpservicelist";
                        }
                    } else {
                        List<AccessibilityNodeInfo> list1 = rootNode.findAccessibilityNodeInfosByViewId("com.tencent.mm:id/c5q");//ListView的id
                        if (list1.size()>0){
                            for (AccessibilityNodeInfo item : list1) {
                                final AccessibilityNodeInfo it = item;
                                List<AccessibilityNodeInfo> apr = rootNode.findAccessibilityNodeInfosByViewId("com.tencent.mm:id/apr");//名字
                                Log.e("apr.size=", apr.size() + "");
                                if (apr.size() > 0) {
                                    final AccessibilityNodeInfo first_apr = apr.get(0);
                                    final AccessibilityNodeInfo last_apr = apr.get(apr.size() - 1);
                                    Log.e("first_apr_str=", first_apr.getText().toString());
                                    Log.e("last_apr_str=", last_apr.getText().toString());
                                    objFrom = "mpservicelist-scroll";
                                    if (last_apr_str.equals(last_apr.getText().toString())) {
                                        objFrom = "null";
//                                        performGlobalAction(AccessibilityService.GLOBAL_ACTION_RECENTS);
                                        closeWechat();
                                    } else {
//                                        objFrom = "mpservicelist-scroll";
                                        it.performAction(AccessibilityNodeInfo.ACTION_SCROLL_FORWARD);
                                    }
                                    last_apr_str = last_apr.getText().toString();
                                }else{
                                    objFrom = "null";
//                                    performGlobalAction(AccessibilityService.GLOBAL_ACTION_RECENTS);
                                    closeWechat();
                                }
                            }
                        }else{
                            closeWechat();
                        }
                    }
                }else {
                    closeWechat();
                }
            }
        },1000);
        //*/
    }
    /**
     * 通过ID获取控件，并进行模拟点击
     *
     * @param clickId
     */
    @TargetApi(Build.VERSION_CODES.JELLY_BEAN_MR2)
    private void inputClick(String clickId) {
        AccessibilityNodeInfo nodeInfo = getRootInActiveWindow();
        if (nodeInfo != null) {
            List<AccessibilityNodeInfo> list = nodeInfo.findAccessibilityNodeInfosByViewId(clickId);
            for (AccessibilityNodeInfo item : list) {
                item.performAction(AccessibilityNodeInfo.ACTION_CLICK);
            }
        }
    }

    private void browserMoreChildrenClick(String viewId, String who) {
        AccessibilityNodeInfo nodeInfo = getRootInActiveWindow();
        List<AccessibilityNodeInfo> list = nodeInfo.findAccessibilityNodeInfosByViewId(viewId);
        for (AccessibilityNodeInfo item : list) {
            if (item.getChildCount() > 5){

                for (int i = 0; i < item.getChildCount(); i++) {
                    if (i == 4) {
                        objFrom = "browserMore";
                        item.getChild(i).performAction(AccessibilityNodeInfo.ACTION_CLICK);
                        break;
                    }
                }
            }else{

                for (int i = 0; i < item.getChildCount(); i++) {
                    if (i == 3) {
                        objFrom = "browserMore-refresh";
                        item.getChild(i).performAction(AccessibilityNodeInfo.ACTION_CLICK);
                        new  Handler().postDelayed(new Runnable() {
                            @Override
                            public void run() {
                                browserMoreChildrenClick("com.tencent.mm:id/c_v", "复制链接");
                            }
                        },5000);
                        break;
                    }
                }
            }
        }

    }

    private boolean hasCurMpName(AccessibilityNodeInfo info) {
        if (info.getChildCount() == 0) {
            if (info.getText() != null) {
//                Log.e("hasCurMpName", info.getChildCount() + "");
                Log.e("hasCurMpName", info.getText().toString());
                if (curMpName.equals(info.getText().toString())) {
                    return true;
                }
            }
        } else {
            for (int i = 0; i < info.getChildCount(); i++) {
                if (info.getChild(i) != null) {
                    Log.e("for", i + "");
                    if (hasCurMpName(info.getChild(i))) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * 中断服务的回调
     */
    @Override
    public void onInterrupt() {
        Log.e("Rebot,interrupt","no");
    }

    /**
     * 判断是否处于亮屏状态
     *
     * @return true-亮屏，false-暗屏
     */
    private boolean isScreenOn() {
        PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
        isScreenOn = pm.isScreenOn();
        Log.e("isScreenOn", isScreenOn + "");
        return isScreenOn;
    }

    /**
     * 解锁屏幕
     */
    private void wakeUpScreen() {

        //获取电源管理器对象
        PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
        //后面的参数|表示同时传入两个值，最后的是调试用的Tag
        wakeLock = pm.newWakeLock(PowerManager.ACQUIRE_CAUSES_WAKEUP | PowerManager.FULL_WAKE_LOCK, "bright");

        //点亮屏幕
        wakeLock.acquire();

        //得到键盘锁管理器
        KeyguardManager km = (KeyguardManager) getSystemService(Context.KEYGUARD_SERVICE);
        keyguardLock = km.newKeyguardLock("unlock");

        //解锁
        keyguardLock.disableKeyguard();
    }
    private void lockScreen(){
        if (wakeLock != null){
//            wakeLock.release();
        }
        if (keyguardLock !=null){
            keyguardLock.reenableKeyguard();
        }
    }
}