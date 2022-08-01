/*!
 * ============================================================================
 *   Creative Innovation Center, LG ELECTRONICS INC., SEOUL, KOREA                       
 *   Copyright(c) 2018 by LG Electronics Inc.                                  
 *                                                                             
 *   Release Version : 1.24.6.5895                              
 * ============================================================================
 */
import site from '../../app/config/site.json';
// import logger from './log';
// import * as Sentry from '@sentry/react';
var extHcapSecure;
var extRegisterHcapCloseHandler;
var extDisableHcapConsoleLog;
var extWebWorker;
var hcap;
if (hcap === undefined) {
   (function () {
      hcap = {
         API_VERSION: "1.24.6.5895"
      };
      var keyCodes = [],
         command_seq_num = 0,
         hcap_queue = [{
            command_id: "0",
            param_text: '{"command_id" : "0", "command" : "notify_sdk_version", "hcap_js_extension_version" : "1.24.6.5895"}'
         }],
         webSocket = null,
         socketOpen = false,
         socketConnecting = false,
         hcapSending = false,
         open_websocket = null,
         hcap_socket_send = null,
         hcap_call = null,
         invalid_os = false,
         format_hcap_log = null,
         hcap_media_obj = null,
         //WCI mods
         supress_mpi_log = true,
         isDev = (process.env.REACT_APP_ENV === 'development' && check_os_version()),
         //Looping websocket close detection and remediation logic
         socketCloseCount = 0,
         hcapCritical = false,
         socket_action_timeouts = {
            hcap_socket_onopen: 5,
            hcap_socket_onclose: 50,
            hcap_socket_send: 500
         },
         socket_close_tolerances = {
            'warn': 10,
            'critical': 100
         };
      function hcap_log(r) {
         if (extDisableHcapConsoleLog !== true) {
            var t;
            if (r.length > 1024) {
               t = r.substring(0, 1024)
            } else {
               t = r
            }
            if (extWebWorker !== true) {
               console.log(t)
            }
         }
      }
      if (extDisableHcapConsoleLog === true) {
         if (extWebWorker !== true) {
            console.log("hcap console log is disabled")
         }
      } else {
         if (extWebWorker !== true) {
            console.log("hcap console log is enabled")
         }
      }
      hcap_log("check external value : extDisableHcapConsoleLog = " + extDisableHcapConsoleLog + ", extHcapSecure = " + extHcapSecure + ", extRegisterHcapCloseHandler = " + extRegisterHcapCloseHandler);

      function check_os_version() {
         var r = navigator.userAgent,
            isWindows = r.match(/Windows/),
            isMac = r.match(/Android/),
            isOSX = r.match(/Mac OS X/);
         hcap_log("UA = '" + r + "'");
         if (isWindows || isMac || isOSX) {
            hcap_log("HCAP websocket off");
            if (isDev) {
               console.log("****** WCI Emulation Enabled ********");
               return false
            }
            return true
         }
         return false
      }
      invalid_os = check_os_version();

      function h(r, x, s, y) {
         var v = "",
            t = "",
            u = "";
         u = x[r];
         try {
            v = s[u];
            t = typeof v
         } catch (w) {
            v = "<unknown value>";
            t = "unknown"
         }
         if (t === "function") {
            v = "{/*function*/}"
         } else {
            if (t === "object") {
               v = format_hcap_log("", v)
            } else {
               if (t === "string") {
                  v = '"' + v + '"'
               }
            }
         }
         y += '"' + u + '" : ' + v;
         if (r < x.length - 1) {
            y += ", "
         }
         return y
      }
      format_hcap_log = function (u, s) {
         var t = 0,
            r = "",
            v = [],
            w = "";
         for (r in s) {
            if (s.hasOwnProperty(r)) {
               v.push(r)
            }
         }
         v.sort();
         for (t = 0; t < v.length; t += 1) {
            w = h(t, v, s, w)
         }
         return u + "{" + w + "}"
      };

      function handle_event(v, u) {
         if (extWebWorker !== true) {
            var t = "",
               s = v,
               r = document.createEvent("HTMLEvents");
            hcap_log(format_hcap_log("event received, ", u));
            r.initEvent(s, true, false);
            for (t in u) {
               if (u.hasOwnProperty(t)) {
                  r[t] = u[t]
               }
            }
            document.dispatchEvent(r)
         }
      }
      open_websocket = function () {
         if (socketConnecting) {
            hcap_log("websocket : connection is in progress");
            return
         }
         if (hcapCritical) {
            hcap_log("websocket : Critical Condition do not attempt to open");
            //clear queue so no messages are attempted to be sent
            hcap_queue = []
            return;
         }
         socketConnecting = true;
         if (isDev) {
            hcap_log("hcap emulation connection");
            webSocket = new WebSocket(site.emulationSocketUrl + "/hcap_command")
         }
         else if (extHcapSecure !== true) {
            hcap_log("default hcap connection");
            webSocket = new WebSocket("ws://127.0.0.1:8053/hcap_command")
         }
         else {
            hcap_log("secure hcap connection");
            webSocket = new WebSocket("wss://localhost:8054/hcap_command")
         }
         webSocket.onopen = function () {
            hcap_log("websocket : onopen");
            socketConnecting = false;
            socketOpen = true;
            var event = new CustomEvent('hcap_opened', { 'message': 'hcap socket opened' });
            window.dispatchEvent(event);
            setTimeout(hcap_socket_send, 5)
         };
         webSocket.onmessage = function (r) {
            var w = JSON.parse(r.data),
               s = w.command_id,
               v = w.command,
               u = w.result;
            if (s === "event") {
               if (v === "debug_event_received") {
                  if (w.enable_log) {
                     if (extWebWorker !== true) {
                        console.log("hcap console log is enabled")
                     }
                  } else {
                     if (extWebWorker !== true) {
                        console.log("hcap console log is disabled")
                     }
                  }
                  extDisableHcapConsoleLog = !w.enable_log
               }
               else if (v === 'mpi_data_received' && supress_mpi_log) {
                  //do nothing do not log
                  return
               }
               else {
                  handle_event(v, w)
               }
            } else {
               if (hcap_queue.length > 0 && hcap_queue[0].command_id === s) {
                  if (w.command !== 'send_udp_data') {
                     hcap_log(format_hcap_log("command_id = " + s + " received, ", w));
                  }
                  if (u) {
                     if (hcap_queue[0].onSuccess) {
                        try {
                           hcap_queue[0].onSuccess(w)
                           if (socketCloseCount >= socket_close_tolerances.critical) {
                              //we have a successful message we can reset the open/close loop remediation
                              console.log("We have remediated the hcap loop");
                              hcapCritical = false;
                              // logger.logEvent("SOCKET_REMEDIATED");
                              // Sentry.captureMessage("SOCKET_REMEDIATED");
                              socket_action_timeouts = {
                                 hcap_socket_onopen: 5,
                                 hcap_socket_onclose: 50,
                                 hcap_socket_send: 500
                              }
                              socketCloseCount = 0;
                           }
                        } catch (t) {
                           hcap_log(format_hcap_log("exception : onSuccess : " + t))
                        }
                     }
                  } else {
                     if (hcap_queue[0].onFailure) {
                        try {
                           hcap_queue[0].onFailure(w)
                        } catch (t) {
                           hcap_log(format_hcap_log("exception : onFailure : " + t))
                        }
                     }
                  }
                  hcap_queue.splice(0, 1);
                  hcapSending = false;
                  hcap_socket_send()
               } else {
                  hcap_log(format_hcap_log("invalid response from server ", w));
                  hcapSending = false;
                  hcap_socket_send()
               }
            }
         };
         webSocket.onclose = function () {
            hcap_log("websocket : onclose");
            socketConnecting = false;
            socketOpen = false;
            hcapSending = false;
            socketCloseCount += 1;
            var event = new CustomEvent('hcap_closed', { 'message': 'hcap socket closed' });
            document.dispatchEvent(event);
            if (socketCloseCount === socket_close_tolerances.warn) {
               console.log("Warning.. Socket has closed " + socketCloseCount + " times");
               // logger.logEvent("SOCKET_WARN");
               // Sentry.captureMessage("SOCKET_WARN");
            }
            else if (socketCloseCount === socket_close_tolerances.critical) {
               console.log("Critial! Socket has closed " + socketCloseCount + " times!");
               hcapCritical = true;
               // logger.logEvent("SOCKET_CRITICAL");
               // Sentry.captureMessage("SOCKET_CRITICAL");
               hcap_queue = []; //blow away the queue and slow down socket stuff
               socket_action_timeouts.hcap_socket_onclose = 5000;
               socket_action_timeouts.hcap_socket_onopen = 5000;
            }
            setTimeout(hcap_socket_send, socket_action_timeouts.hcap_socket_onclose)
         };
         if (extRegisterHcapCloseHandler === "onbeforeunload") {
            window.onbeforeunload = function () {
               hcap_log("close hcap websocket in onbeforeunload handler");
               webSocket.onclose = function () {
                  return undefined
               };
               webSocket.close()
            }
         } else {
            if (extRegisterHcapCloseHandler === "onunload") {
               window.onunload = function () {
                  hcap_log("close hcap websocket in onunload handler");
                  webSocket.onclose = function () {
                     return undefined
                  };
                  webSocket.close()
               }
            }
         }
      };
      hcap_socket_send = function () {
         if (hcapSending) {
            return
         }
         hcapSending = true;
         if (socketOpen) {
            if (hcap_queue.length > 0) {
               hcap_log(format_hcap_log("command_id = " + hcap_queue[0].command_id + " sent, ", JSON.parse(hcap_queue[0].param_text)));
               webSocket.send(hcap_queue[0].param_text);
               return
            }
         } else {
            open_websocket()
         }
         hcapSending = false
      };
      hcap_call = function (u, t) {
         if (u === null || u === "" || u === undefined) {
            hcap_log('[ERROR] command should not null or empty string! command === null || command === "" || command === undefined');
            return
         }
         if (Object.prototype.toString.call(t) === "[object Array]") {
            hcap_log("[ERROR] param should be Object type({})! param is Array. command = " + u);
            return
         }
         if (t === null || t === undefined) {
            hcap_log("[ERROR] param should be Object type({})! param === null || param === undefined. command = " + u);
            return
         }
         if (invalid_os) {
            if (t.onFailure) {
               t.onFailure({
                  errorMessage: "HCAP WebSocket is not available in this browser"
               })
            }
            return
         }
         if (command_seq_num > 1024) {
            command_seq_num = 0
         } else {
            command_seq_num += 1
         }
         var r = command_seq_num.toString(),
            s = "";
         t.command_id = r;
         t.command = u;
         s = JSON.stringify(t, null);
         hcap_queue[hcap_queue.length] = {
            command_id: r,
            param_text: s,
            onSuccess: t.onSuccess,
            onFailure: t.onFailure
         };
         if (t.command !== 'send_udp_data') {
            hcap_log(format_hcap_log("command_id = " + r + " added, ", hcap_queue[hcap_queue.length - 1]));
         }
         hcap_socket_send()
      };
      if (!invalid_os) {
         setTimeout(hcap_socket_send, 200)
      }
      hcap.preloadedApplication = {};
      hcap.preloadedApplication.getPreloadedApplicationList = function (r) {
         hcap_call("get_preloaded_application_list", r)
      };
      hcap.preloadedApplication.launchPreloadedApplication = function (r) {
         hcap_call("launch_preloaded_application", r)
      };
      hcap.preloadedApplication.destroyPreloadedApplication = function (r) {
         hcap_call("destroy_preloaded_application", r)
      };
      hcap.application = {};
      hcap.application.getServiceXml = function (r) {
         hcap_call("get_service_xml", r)
      };
      hcap.application.getDefaultServiceXml = function (r) {
         hcap_call("get_default_service_xml", r)
      };
      hcap.application.getApplicationList = function (r) {
         hcap_call("get_application_list", r)
      };
      hcap.application.launchApplication = function (r) {
         hcap_call("launch_application", r)
      };
      hcap.application.destroyApplication = function (r) {
         hcap_call("destroy_application", r)
      };
      hcap.application.installApplications = function (r) {
         hcap_call("install_applications", r)
      };
      hcap.application.removeApplications = function (r) {
         hcap_call("remove_applications", r)
      };
      hcap.application.RegisterSIApplicationList = function (r) {
         hcap_call("register_si_app_list", r)
      };
      hcap.video = {};
      hcap.video.getVideoSize = function (r) {
         hcap_call("get_video_size", r)
      };
      hcap.video.setVideoSize = function (r) {
         hcap_call("set_video_size", r)
      };
      hcap.video.getOsdTransparencyLevel = function (r) {
         hcap_call("get_osd_transparency_level", r)
      };
      hcap.video.setOsdTransparencyLevel = function (r) {
         hcap_call("set_osd_transparency_level", r)
      };
      hcap.video.isVideoMute = function (r) {
         hcap_call("get_video_mute", r)
      };
      hcap.video.setVideoMute = function (r) {
         hcap_call("set_video_mute", r)
      };
      hcap.volume = {};
      hcap.volume.getVolumeLevel = function (r) {
         hcap_call("get_volume_level", r)
      };
      hcap.volume.setVolumeLevel = function (r) {
         hcap_call("set_volume_level", r)
      };
      hcap.volume.getExternalSpeakerVolumeLevel = function (r) {
         hcap_call("get_external_speaker_volume_level", r)
      };
      hcap.volume.setExternalSpeakerVolumeLevel = function (r) {
         hcap_call("set_external_speaker_volume_level", r)
      };
      hcap.volume.getHeadphoneVolumeLevel = function (r) {
         hcap_call("get_headphone_volume_level", r)
      };
      hcap.volume.setHeadphoneVolumeLevel = function (r) {
         hcap_call("set_headphone_volume_level", r)
      };
      hcap.volume.setHealthcareHeadphoneMode = function (r) {
         hcap_call("set_healthcare_headphone_mode", r)
      };
      hcap.volume.getHealthcareHeadphoneMode = function (r) {
         hcap_call("get_healthcare_headphone_mode", r)
      };
      hcap.channel = {};
      hcap.channel.NO_STREAM_PID = 8191;
      hcap.channel.ChannelType = {
         UNKNOWN: 0,
         RF: 1,
         IP: 2,
         RF_DATA: 3,
         IP_DATA: 4
      };
      hcap.channel.Polarization = {
         UNKNOWN: 0,
         VERTICAL: 1,
         HORIZONTAL: 2,
         LEFT_HAND_CIRCULAR: 3,
         RIGHT_HAND_CIRCULAR: 4
      };
      hcap.channel.RfBroadcastType = {
         UNKNOWN: 0,
         TERRESTRIAL: 16,
         TERRESTRIAL_2: 17,
         SATELLITE: 32,
         SATELLITE_2: 33,
         SATELLITE_CS1: 34,
         SATELLITE_CS2: 35,
         SATELLITE_S3_BS: 36,
         SATELLITE_S3_CS: 37,
         CABLE: 48,
         CABLE_STD: 49,
         CABLE_HRC: 50,
         CABLE_IRC: 51,
         ANALOG_PAL_BG: 64,
         ANALOG_PAL_DK: 65,
         ANALOG_PAL_I: 66,
         ANALOG_PAL_M: 67,
         ANALOG_PAL_N: 68,
         ANALOG_SECAM_BG: 69,
         ANALOG_SECAM_DK: 70,
         ANALOG_SECAM_L: 71,
         ANALOG_NTSC: 72,
         TERRESTRIAL_ATSC3: 80,
         CABLE_ATSC3: 81
      };
      hcap.channel.IpBroadcastType = {
         UNKNOWN: 0,
         UDP: 16,
         RTP: 32
      };
      hcap.channel.VideoStreamType = {
         MPEG1: 1,
         MPEG2: 2,
         MPEG4_VISUAL: 16,
         MPEG4_AVC_H264: 27,
         HEVC: 36,
         AVS: 66
      };
      hcap.channel.AudioStreamType = {
         MPEG1: 3,
         MPEG2: 4,
         MPEG2_AAC: 15,
         MPEG4_HEAAC: 17,
         AC3: 129,
         EAC3: 130,
         ANALOG_BG: 256,
         ANALOG_I: 257,
         ANALOG_DK: 258,
         ANALOG_L: 259,
         ANALOG_MN: 260,
         ANALOG_LP: 261,
         ANALOG_END: 262
      };
      hcap.channel.InbandDataServiceType = {
         UNKNOWN: 0,
         MHP: 1,
         MHEG: 2,
         HBBTV: 3,
         NONE: 4
      };
      hcap.channel.ChannelStatus = {
         UNKNOWN: 0,
         AUDIO_VIDEO_NOT_BLOCKED: 16,
         AV_DISPLAYED: 16,
         AUDIO_VIDEO_BLOCKED: 33,
         NO_SIGNAL: 33,
         AUDIO_ONLY_BLOCKED: 34,
         VIDEO_ONLY_BLOCKED: 35
      };
      hcap.channel.requestChangeCurrentChannel = function (r) {
         hcap_call("request_channel_change", r)
      };
      hcap.channel.getCurrentChannel = function (r) {
         hcap_call("get_current_channel", r)
      };
      hcap.channel.replayCurrentChannel = function (r) {
         hcap_call("replay_current_channel", r)
      };
      hcap.channel.stopCurrentChannel = function (r) {
         hcap_call("stop_current_channel", r)
      };
      hcap.channel.getDataChannel = function (r) {
         hcap_call("get_data_channel", r)
      };
      hcap.channel.getChannelMap = function (r) {
         hcap_call("get_channel_map", r)
      };
      hcap.channel.getStartChannel = function (r) {
         hcap_call("get_start_channel", r)
      };
      hcap.channel.setStartChannel = function (r) {
         hcap_call("set_start_channel", r)
      };
      hcap.channel.getCurrentChannelAudioLanguageList = function (r) {
         hcap_call("get_current_channel_audio_language_list", r)
      };
      hcap.channel.getCurrentChannelAudioLanguageIndex = function (r) {
         hcap_call("get_current_channel_audio_language_index", r)
      };
      hcap.channel.setCurrentChannelAudioLanguageIndex = function (r) {
         hcap_call("set_current_channel_audio_language_index", r)
      };
      hcap.channel.getCurrentChannelSubtitleList = function (r) {
         hcap_call("get_current_channel_subtitle_language_list", r)
      };
      hcap.channel.getCurrentChannelSubtitleIndex = function (r) {
         hcap_call("get_current_channel_subtitle_language_index", r)
      };
      hcap.channel.setCurrentChannelSubtitleIndex = function (r) {
         hcap_call("set_current_channel_subtitle_language_index", r)
      };
      hcap.channel.getProgramInfo = function (r) {
         hcap_call("get_program_info", r)
      };
      hcap.channel.launchInbandDataService = function (r) {
         hcap_call("launch_inband_data_service", r)
      };
      hcap.channel.getReadyInbandDataService = function (r) {
         hcap_call("get_ready_inband_data_service", r)
      };
      hcap.channel.getChannelSignalStatus = function (r) {
         hcap_call("get_channel_signal_status", r)
      };
      hcap.externalinput = {};
      hcap.externalinput.ExternalInputType = {
         TV: 1,
         COMPOSITE: 2,
         SVIDEO: 3,
         COMPONENT: 4,
         RGB: 5,
         HDMI: 6,
         SCART: 7,
         USB: 8,
         OTHERS: 9
      };
      hcap.externalinput.getCurrentExternalInput = function (r) {
         hcap_call("get_external_input", r)
      };
      hcap.externalinput.setCurrentExternalInput = function (r) {
         hcap_call("set_external_input", r)
      };
      hcap.externalinput.isExternalInputConnected = function (r) {
         hcap_call("check_external_input_connected", r)
      };
      hcap.externalinput.getExternalInputList = function (r) {
         hcap_call("get_external_input_list", r)
      };
      hcap.carousel = {};
      hcap.carousel.requestCacheCarouselData = function (r) {
         hcap_call("request_content", r)
      };
      hcap.carousel.isCarouselDataCached = function (r) {
         hcap_call("is_content_loaded", r)
      };
      hcap.carousel.clearCarouselDataCache = function (r) {
         hcap_call("clear_content_cache", r)
      };
      hcap.mpi = {};
      hcap.mpi.sendAndReceiveMpiData = function (r) {
         hcap_call("send_and_receive_mpi_data", r)
      };
      hcap.mpi.sendMpiData = function (r) {
         hcap_call("send_mpi_data", r)
      };
      hcap.power = {};
      hcap.power.PowerMode = {
         WARM: 2,
         NORMAL: 1
      };
      hcap.power.getPowerMode = function (r) {
         hcap_call("get_power_mode", r)
      };
      hcap.power.setPowerMode = function (r) {
         hcap_call("set_power_mode", r)
      };
      hcap.power.isWarmUpdate = function (r) {
         hcap_call("is_power_warm_update", r)
      };
      hcap.power.powerOff = function (r) {
         hcap_call("power_off", r)
      };
      hcap.power.reboot = function (r) {
         hcap_call("reboot", r)
      };
      hcap.time = {};
      hcap.time.setLocalTime = function (r) {
         hcap_call("set_tv_localtime", r)
      };
      hcap.time.getLocalTime = function (r) {
         hcap_call("get_tv_localtime", r)
      };
      hcap.time.getPowerOffTimer = function (r) {
         hcap_call("get_power_off_timer_in_min", r)
      };
      hcap.time.setPowerOffTimer = function (r) {
         hcap_call("set_power_off_timer_in_min", r)
      };
      hcap.time.getPowerOnTime = function (r) {
         hcap_call("get_power_on_time", r)
      };
      hcap.time.setPowerOnTime = function (r) {
         hcap_call("set_power_on_time", r)
      };
      hcap.time.getAlarmInformation = function (r) {
         hcap_call("get_alarm_information", r)
      };
      hcap.time.setAlarmInformation = function (r) {
         hcap_call("set_alarm_information", r)
      };
      hcap.time.getCpuTime = function (r) {
         hcap_call("get_cpu_time", r)
      };
      hcap.network = {};
      hcap.network.getNumberOfNetworkDevices = function (r) {
         hcap_call("get_number_of_network_devices", r)
      };
      hcap.network.getNetworkDevice = function (r) {
         hcap_call("get_network_device", r)
      };
      hcap.network.setNetworkDevice = function (r) {
         hcap_call("set_network_device", r)
      };
      hcap.network.ping = function (r) {
         hcap_call("ping", r)
      };
      hcap.network.NetworkEventType = {
         UNKNOWN: 0,
         ETHERNET_PLUGGED: 1,
         ETHERNET_UNPLUGGED: 2,
         WIFI_DONGLE_PLUGGED: 3,
         WIFI_DONGLE_UNPLUGGED: 4,
         IP_CONFLICT: 5,
         IP_NOT_CONFLICT: 6,
         DHCP_SUCCESS: 7,
         DHCP_FAIL: 8,
         UNABLE_REACH_GATEWAY: 9,
         ABLE_REACH_GATEWAY: 10,
         UNABLE_REACH_DNS: 11,
         ABLE_REACH_DNS: 12,
         UNABLE_REACH_INTERNET: 13,
         ABLE_REACH_INTERNET: 14,
         WIFI_AP_SEARCH_COMPLETE: 15,
         WIFI_CONNECTED: 16,
         WIFI_CONNECT_FAIL: 17,
         WIFI_LINK_DROPPED: 18
      };
      hcap.network.NetworkMode = {
         UNKNOWN: 0,
         WIRE: 1,
         WIRELESS: 2,
         NOT_REACHABLE: 3
      };
      hcap.network.WirelessMode = {
         UNKNOWN: 0,
         INFRA: 1,
         ADHOC: 2
      };
      hcap.network.WifiSecurityType = {
         UNKNOWN: 0,
         OPEN: 1,
         WEP: 2,
         WPA_PSK_TKIP: 3,
         WPA_PSK_AES: 4,
         WPA2_PSK_TKIP: 5,
         WPA2_PSK_AES: 6,
         WPA12_PSK_AES_TKIPAES: 7
      };
      hcap.network.DhcpState = {
         UNKNOWN: 0,
         INIT: 1,
         SELECTING: 2,
         REQUESTING: 3,
         BOUND: 4,
         RENEWING: 5,
         REBINDING: 6,
         INIT_REBOOT: 7,
         REBOOTING: 8
      };
      hcap.network.getNetworkInformation = function (r) {
         hcap_call("get_network_information", r)
      };
      hcap.network.getSoftAP = function (r) {
         hcap_call("get_soft_ap", r)
      };
      hcap.network.setSoftAP = function (r) {
         hcap_call("set_soft_ap", r)
      };
      hcap.network.getWifiDiagnostics = function (r) {
         hcap_call("get_wifi_diagnostics", r)
      };
      hcap.network.asyncPing = function (r) {
         hcap_call("async_ping", r)
      };
      hcap.network.setVlanIdMode = function (r) {
         hcap_call("set_vlan_id_mode", r)
      };
      hcap.network.getVlanIdMode = function (r) {
         hcap_call("get_vlan_id_mode", r)
      };
      hcap.network.getLanId = function (r) {
         hcap_call("get_lan_id", r)
      };
      hcap.network.setLanId = function (r) {
         hcap_call("set_lan_id", r)
      };
      hcap.network.getAuxLanId = function (r) {
         hcap_call("get_aux_lan_id", r)
      };
      hcap.network.setAuxLanId = function (r) {
         hcap_call("set_aux_lan_id", r)
      };
      hcap.network.getBlockedPortList = function (r) {
         hcap_call("get_blocked_port_list", r)
      };
      hcap.network.setBlockedPortList = function (r) {
         hcap_call("set_blocked_port_list", r)
      };
      hcap.mode = {};
      hcap.mode.HCAP_MODE_0 = 257;
      hcap.mode.HCAP_MODE_1 = 258;
      hcap.mode.HCAP_MODE_2 = 259;
      hcap.mode.HCAP_MODE_3 = 260;
      hcap.mode.HCAP_MODE_4 = 261;
      hcap.mode.getHcapMode = function (r) {
         hcap_call("get_mw_mode", r)
      };
      hcap.mode.setHcapMode = function (r) {
         hcap_call("set_mw_mode", r)
      };
      hcap.key = {};
      hcap.key.Code = {
         NUM_0: 48,
         NUM_1: 49,
         NUM_2: 50,
         NUM_3: 51,
         NUM_4: 52,
         NUM_5: 53,
         NUM_6: 54,
         NUM_7: 55,
         NUM_8: 56,
         NUM_9: 57,
         CH_UP: 427,
         CH_DOWN: 428,
         GUIDE: 458,
         INFO: 457,
         LEFT: 37,
         UP: 38,
         RIGHT: 39,
         DOWN: 40,
         ENTER: 13,
         BACK: 461,
         EXIT: 1001,
         RED: 403,
         GREEN: 404,
         YELLOW: 405,
         BLUE: 406,
         STOP: 413,
         PLAY: 415,
         PAUSE: 19,
         REWIND: 412,
         FAST_FORWARD: 417,
         LAST_CH: 711,
         PORTAL: 602,
         ORDER: 623,
         MINUS: 704,
         POWER: 409,
         VOL_UP: 447,
         VOL_DOWN: 448,
         MUTE: 449,
         RECORD: 416,
         PAGE_UP: 33,
         PAGE_DOWN: 34,
         RF_BYPASS: 29,
         NEXT_DAY: 425,
         PREV_DAY: 424,
         APPS: 93,
         LINK: 606,
         FORWARD: 167,
         ZOOM: 251,
         SETTINGS: 611,
         NEXT_FAV_CH: 176,
         RES_1: 112,
         RES_2: 113,
         RES_3: 114,
         RES_4: 115,
         RES_5: 116,
         RES_6: 117,
         LOCK: 619,
         SKIP: 620,
         LIST: 1006,
         LIVE: 622,
         ON_DEMAND: 623,
         PINP_MOVE: 624,
         PINP_UP: 625,
         PINP_DOWN: 626,
         MENU: 18,
         AD: 700,
         ALARM: 701,
         AV_MODE: 31,
         SUBTITLE: 460,
         CC: 1008,
         DISC_POWER_OFF: 705,
         DISC_POWER_ON: 706,
         DVD: 707,
         EJECT: 414,
         ENERGY_SAVING: 709,
         FAV: 710,
         FLASHBK: 711,
         INPUT: 712,
         MARK: 713,
         NETCAST: 1000,
         PIP: 715,
         PIP_CH_DOWN: 716,
         PIP_CH_UP: 717,
         PIP_INPUT: 718,
         PIP_SWAP: 719,
         Q_MENU: 1002,
         Q_VIEW: 1007,
         RATIO: 1005,
         SAP: 723,
         SIMPLINK: 724,
         STB: 725,
         T_OPT: 1004,
         TEXT: 459,
         SLEEP_TIMER: 729,
         TV: 730,
         TV_RAD: 731,
         VCR: 732,
         POWER_LOWBATTERY: 733,
         SMART_HOME: 734,
         SCREEN_REMOTE: 735,
         POINTER: 736,
         LG_3D: 737,
         DATA: 738,
         ASSISTIVE_MENU: 739,
         THREE_DIGIT_INPUT: 740,
         LIVETV: 741,
         GOTOPREV: 742,
         GOTONEXT: 743,
         TER: 744,
         BS: 745,
         CS1: 746,
         CS2: 747,
         CS4K: 748,
         BS4K: 749,
         NUM_11: 750,
         NUM_12: 751,
         NETFLIX: 1037
      };
      keyCodes[hcap.key.Code.NUM_0] = hcap.key.Code.NUM_0;
      keyCodes[hcap.key.Code.NUM_1] = hcap.key.Code.NUM_1;
      keyCodes[hcap.key.Code.NUM_2] = hcap.key.Code.NUM_2;
      keyCodes[hcap.key.Code.NUM_3] = hcap.key.Code.NUM_3;
      keyCodes[hcap.key.Code.NUM_4] = hcap.key.Code.NUM_4;
      keyCodes[hcap.key.Code.NUM_5] = hcap.key.Code.NUM_5;
      keyCodes[hcap.key.Code.NUM_6] = hcap.key.Code.NUM_6;
      keyCodes[hcap.key.Code.NUM_7] = hcap.key.Code.NUM_7;
      keyCodes[hcap.key.Code.NUM_8] = hcap.key.Code.NUM_8;
      keyCodes[hcap.key.Code.NUM_9] = hcap.key.Code.NUM_9;
      keyCodes[hcap.key.Code.CH_UP] = hcap.key.Code.CH_UP;
      keyCodes[hcap.key.Code.CH_DOWN] = hcap.key.Code.CH_DOWN;
      keyCodes[hcap.key.Code.GUIDE] = hcap.key.Code.GUIDE;
      keyCodes[hcap.key.Code.INFO] = hcap.key.Code.INFO;
      keyCodes[hcap.key.Code.LEFT] = hcap.key.Code.LEFT;
      keyCodes[hcap.key.Code.UP] = hcap.key.Code.UP;
      keyCodes[hcap.key.Code.RIGHT] = hcap.key.Code.RIGHT;
      keyCodes[hcap.key.Code.DOWN] = hcap.key.Code.DOWN;
      keyCodes[hcap.key.Code.ENTER] = 10;
      keyCodes[hcap.key.Code.BACK] = 608;
      keyCodes[hcap.key.Code.EXIT] = 601;
      keyCodes[hcap.key.Code.RED] = hcap.key.Code.RED;
      keyCodes[hcap.key.Code.GREEN] = hcap.key.Code.GREEN;
      keyCodes[hcap.key.Code.YELLOW] = hcap.key.Code.YELLOW;
      keyCodes[hcap.key.Code.BLUE] = hcap.key.Code.BLUE;
      keyCodes[hcap.key.Code.STOP] = hcap.key.Code.STOP;
      keyCodes[hcap.key.Code.PLAY] = hcap.key.Code.PLAY;
      keyCodes[hcap.key.Code.PAUSE] = hcap.key.Code.PAUSE;
      keyCodes[hcap.key.Code.REWIND] = hcap.key.Code.REWIND;
      keyCodes[hcap.key.Code.FAST_FORWARD] = hcap.key.Code.FAST_FORWARD;
      keyCodes[hcap.key.Code.LAST_CH] = 607;
      keyCodes[hcap.key.Code.PORTAL] = hcap.key.Code.PORTAL;
      keyCodes[hcap.key.Code.ORDER] = hcap.key.Code.ORDER;
      keyCodes[hcap.key.Code.MINUS] = 45;
      keyCodes[hcap.key.Code.POWER] = hcap.key.Code.POWER;
      keyCodes[hcap.key.Code.VOL_UP] = hcap.key.Code.VOL_UP;
      keyCodes[hcap.key.Code.VOL_DOWN] = hcap.key.Code.VOL_DOWN;
      keyCodes[hcap.key.Code.MUTE] = hcap.key.Code.MUTE;
      keyCodes[hcap.key.Code.RECORD] = hcap.key.Code.RECORD;
      keyCodes[hcap.key.Code.PAGE_UP] = hcap.key.Code.PAGE_UP;
      keyCodes[hcap.key.Code.PAGE_DOWN] = hcap.key.Code.PAGE_DOWN;
      keyCodes[hcap.key.Code.RF_BYPASS] = 600;
      keyCodes[hcap.key.Code.NEXT_DAY] = 603;
      keyCodes[hcap.key.Code.PREV_DAY] = 604;
      keyCodes[hcap.key.Code.APPS] = 605;
      keyCodes[hcap.key.Code.LINK] = hcap.key.Code.LINK;
      keyCodes[hcap.key.Code.FORWARD] = 609;
      keyCodes[hcap.key.Code.ZOOM] = 610;
      keyCodes[hcap.key.Code.SETTINGS] = hcap.key.Code.SETTINGS;
      keyCodes[hcap.key.Code.NEXT_FAV_CH] = 612;
      keyCodes[hcap.key.Code.RES_1] = 613;
      keyCodes[hcap.key.Code.RES_2] = 614;
      keyCodes[hcap.key.Code.RES_3] = 615;
      keyCodes[hcap.key.Code.RES_4] = 616;
      keyCodes[hcap.key.Code.RES_5] = 617;
      keyCodes[hcap.key.Code.RES_6] = 618;
      keyCodes[hcap.key.Code.LOCK] = hcap.key.Code.LOCK;
      keyCodes[hcap.key.Code.SKIP] = hcap.key.Code.SKIP;
      keyCodes[hcap.key.Code.LIST] = 621;
      keyCodes[hcap.key.Code.LIVE] = hcap.key.Code.LIVE;
      keyCodes[hcap.key.Code.ON_DEMAND] = hcap.key.Code.ON_DEMAND;
      keyCodes[hcap.key.Code.PINP_MOVE] = hcap.key.Code.PINP_MOVE;
      keyCodes[hcap.key.Code.PINP_UP] = hcap.key.Code.PINP_UP;
      keyCodes[hcap.key.Code.PINP_DOWN] = hcap.key.Code.PINP_DOWN;
      keyCodes[hcap.key.Code.MENU] = 627;
      keyCodes[hcap.key.Code.AD] = hcap.key.Code.AD;
      keyCodes[hcap.key.Code.ALARM] = hcap.key.Code.ALARM;
      keyCodes[hcap.key.Code.AV_MODE] = 702;
      keyCodes[hcap.key.Code.SUBTITLE] = 726;
      keyCodes[hcap.key.Code.CC] = 726;
      keyCodes[hcap.key.Code.DISC_POWER_OFF] = hcap.key.Code.DISC_POWER_OFF;
      keyCodes[hcap.key.Code.DISC_POWER_ON] = hcap.key.Code.DISC_POWER_ON;
      keyCodes[hcap.key.Code.DVD] = hcap.key.Code.DVD;
      keyCodes[hcap.key.Code.EJECT] = 708;
      keyCodes[hcap.key.Code.ENERGY_SAVING] = hcap.key.Code.ENERGY_SAVING;
      keyCodes[hcap.key.Code.FAV] = hcap.key.Code.FAV;
      keyCodes[hcap.key.Code.FLASHBK] = hcap.key.Code.FLASHBK;
      keyCodes[hcap.key.Code.INPUT] = hcap.key.Code.INPUT;
      keyCodes[hcap.key.Code.MARK] = hcap.key.Code.MARK;
      keyCodes[hcap.key.Code.NETCAST] = 714;
      keyCodes[hcap.key.Code.PIP] = hcap.key.Code.PIP;
      keyCodes[hcap.key.Code.PIP_CH_DOWN] = hcap.key.Code.PIP_CH_DOWN;
      keyCodes[hcap.key.Code.PIP_CH_UP] = hcap.key.Code.PIP_CH_UP;
      keyCodes[hcap.key.Code.PIP_INPUT] = hcap.key.Code.PIP_INPUT;
      keyCodes[hcap.key.Code.PIP_SWAP] = hcap.key.Code.PIP_SWAP;
      keyCodes[hcap.key.Code.Q_MENU] = 720;
      keyCodes[hcap.key.Code.Q_VIEW] = 721;
      keyCodes[hcap.key.Code.RATIO] = 722;
      keyCodes[hcap.key.Code.SAP] = hcap.key.Code.SAP;
      keyCodes[hcap.key.Code.SIMPLINK] = hcap.key.Code.SIMPLINK;
      keyCodes[hcap.key.Code.STB] = hcap.key.Code.STB;
      keyCodes[hcap.key.Code.T_OPT] = 727;
      keyCodes[hcap.key.Code.TEXT] = 728;
      keyCodes[hcap.key.Code.SLEEP_TIMER] = hcap.key.Code.SLEEP_TIMER;
      keyCodes[hcap.key.Code.TV] = hcap.key.Code.TV;
      keyCodes[hcap.key.Code.TV_RAD] = hcap.key.Code.TV_RAD;
      keyCodes[hcap.key.Code.VCR] = hcap.key.Code.VCR;
      keyCodes[hcap.key.Code.POWER_LOWBATTERY] = hcap.key.Code.POWER_LOWBATTERY;
      keyCodes[hcap.key.Code.SMART_HOME] = hcap.key.Code.SMART_HOME;
      keyCodes[hcap.key.Code.SCREEN_REMOTE] = hcap.key.Code.SCREEN_REMOTE;
      keyCodes[hcap.key.Code.POINTER] = hcap.key.Code.POINTER;
      keyCodes[hcap.key.Code.LG_3D] = hcap.key.Code.LG_3D;
      keyCodes[hcap.key.Code.DATA] = hcap.key.Code.DATA;
      keyCodes[hcap.key.Code.ASSISTIVE_MENU] = hcap.key.Code.ASSISTIVE_MENU;
      keyCodes[hcap.key.Code.THREE_DIGIT_INPUT] = hcap.key.Code.THREE_DIGIT_INPUT;
      keyCodes[hcap.key.Code.LIVETV] = hcap.key.Code.LIVETV;
      keyCodes[hcap.key.Code.GOTOPREV] = hcap.key.Code.GOTOPREV;
      keyCodes[hcap.key.Code.GOTONEXT] = hcap.key.Code.GOTONEXT;
      keyCodes[hcap.key.Code.TER] = hcap.key.Code.TER;
      keyCodes[hcap.key.Code.BS] = hcap.key.Code.BS;
      keyCodes[hcap.key.Code.CS1] = hcap.key.Code.CS1;
      keyCodes[hcap.key.Code.CS2] = hcap.key.Code.CS2;
      keyCodes[hcap.key.Code.CS4K] = hcap.key.Code.CS4K;
      keyCodes[hcap.key.Code.BS4K] = hcap.key.Code.BS4K;
      keyCodes[hcap.key.Code.NUM_11] = hcap.key.Code.NUM_11;
      keyCodes[hcap.key.Code.NUM_12] = hcap.key.Code.NUM_12;
      keyCodes[hcap.key.Code.NETFLIX] = 752;
      hcap.key.addKeyItem = function (r) {
         r.virtualKeycode = keyCodes[r.virtualKeycode];
         hcap_call("add_key_item", r)
      };
      hcap.key.removeKeyItem = function (r) {
         hcap_call("remove_key_item", r)
      };
      hcap.key.clearKeyTable = function (r) {
         hcap_call("clear_key_table", r)
      };
      hcap.key.sendKey = function (r) {
         r.virtualKeycode = keyCodes[r.virtualKeycode];
         hcap_call("send_key", r)
      };
      hcap.mouse = {};
      hcap.mouse.isMouseVisible = function (r) {
         hcap_call("get_mouse_visible", r)
      };
      hcap.mouse.setMouseVisible = function (r) {
         hcap_call("set_mouse_visible", r)
      };
      hcap.mouse.isPointerOn = function (r) {
         hcap_call("is_pointer_on", r)
      };
      hcap.mouse.setPointerOn = function (r) {
         hcap_call("set_pointer_on", r)
      };
      hcap.mouse.getPointerPosition = function (r) {
         hcap_call("get_pointer_position", r)
      };
      hcap.mouse.setPointerPosition = function (r) {
         hcap_call("set_pointer_position", r)
      };
      hcap.mouse.clickPointer = function (r) {
         hcap_call("click_pointer", r)
      };
      hcap.mouse.setPointerSize = function (r) {
         hcap_call("set_pointer_size", r)
      };
      hcap.property = {};
      hcap.property.getHotelMode = function (r) {
         hcap_call("get_hotel_mode", r)
      };
      hcap.property.setHotelMode = function (r) {
         hcap_call("set_hotel_mode", r)
      };
      hcap.property.PicturePropertyKey = {
         BACKLIGHT: 1,
         CONTRAST: 2,
         BRIGHTNESS: 3,
         SHARPNESS: 4,
         COLOR: 5,
         TINT: 6,
         COLOR_TEMPERATURE: 7,
         ASPECT_RATIO: 8
      };
      hcap.property.getPictureProperty = function (r) {
         hcap_call("get_picture_property", r)
      };
      hcap.property.setPictureProperty = function (r) {
         hcap_call("set_picture_property", r)
      };
      hcap.property.PictureMode = {
         VIVID: 1,
         STANDARD: 2,
         ECO: 3,
         CINEMA: 4,
         SPORTS: 5,
         GAME: 6,
         PHOTO: 7,
         EXPERT_BRIGHT_ROOM: 8,
         EXPERT_DARK_ROOM: 9
      };
      hcap.property.getPictureMode = function (r) {
         hcap_call("get_picture_mode", r)
      };
      hcap.property.setPictureMode = function (r) {
         hcap_call("set_picture_mode", r)
      };
      hcap.property.getProperty = function (r) {
         hcap_call("get_property", r)
      };
      hcap.property.setProperty = function (r) {
         hcap_call("set_property", r)
      };
      hcap.property.InstallerMenuItem = {
         INSTALLER_SEQ: 0,
         POWER_MANAGE: 1,
         AC_ON: 2,
         BAND: 3,
         STRT_CHANNEL: 4,
         CHAN_LOCK: 5,
         STRT_VOLUME: 7,
         MIN_VOLUME: 8,
         MAX_VOLUME: 9,
         MUTE_DISABLE: 10,
         KEY_DEFEAT: 11,
         IR_BANKS_ENABLE: 12,
         SCAN_MODE: 13,
         STRT_CH_IN_SM: 14,
         SLEEP_TIMER: 15,
         EN_TIMER: 16,
         ALARM: 17,
         FEATURE_LEVEL: 20,
         V_CHIP: 21,
         MAX_BLK_HRS: 22,
         CAPTION_LOCK: 23,
         FUNCTION_PRE: 25,
         HOSPITAL_MODE: 27,
         CH_OVERIDE: 28,
         REMAP_AUX_INPS: 29,
         ACK_MASK: 30,
         POLL_RATE: 31,
         TIMING_PULSE: 32,
         COMPORT_EN: 34,
         HDMI1_ENABLE: 35,
         REAR_AUX_EN: 39,
         SIMPLINK_EN: 41,
         AUTO_INPUTS: 42,
         STRT_AUX_SRCE: 46,
         AUX_STATUS: 47,
         DIS_AUDIO_M: 49,
         DIS_CH_TIME: 53,
         EN_CH_T_COL: 69,
         FOR_CH_TIME: 70,
         BCK_CH_TIME: 71,
         CH_NOT_AVBLE: 73,
         REVERT_CH: 75,
         QUICK_SHUTOFF: 77,
         UPN_MSB: 78,
         UPN_MSB_1: 79,
         UPN_MSB_2: 80,
         UPN_LSB: 81,
         CHKSUM_ERROR: 82,
         HANDSHK_TIME: 83,
         PERMANENT_BLK: 84,
         V_MUTE_TIME: 86,
         REAR_RGB_EN: 87,
         EN_NOISE_MUTE: 88,
         KEY_LOCK: 90,
         HDMI2_ENABLE: 91,
         HDMI3_ENABLE: 92,
         RJP_AVAILABLE: 93,
         SAP_MENU_EN: 94,
         DEF_ASP_RATIO: 96,
         AUDIO_OUTPUT: 97,
         PROCENTRIC: 98,
         BACK_LIGHTING: 99,
         VIDEO_INTERFACE: 100,
         IR_FEEDBACK: 101,
         ATSC_BAND: 102,
         ATSC_TUNE_MODE: 103,
         START_MINOR_CH: 104,
         VID_OUT_FORMAT: 105,
         ASP_RATIO_LOCK: 106,
         BANNER_SELECT: 107,
         PANEL_COM: 108,
         PANEL_HNDSHAKE: 109,
         PANEL_DELAY: 110,
         PANEL_VOL_PRE: 111,
         PANEL_STRT_VOL: 112,
         PANEL_TYPE: 113,
         PANEL_MIN_VOL: 114,
         PANEL_MAX_VOL: 115,
         VIDEO_MUTE_EN: 116,
         FACT_DEFAULT: 117,
         POWER_SAVINGS: 118,
         DATA_CHANNEL: 119,
         UPDATE_TIME_HR: 121,
         UPDATE_TIME_MN: 122
      };
      hcap.property.getInstallerMenuItem = function (r) {
         hcap_call("get_installer_menu_item", r)
      };
      hcap.property.setInstallerMenuItem = function (r) {
         hcap_call("set_installer_menu_item", r)
      };
      hcap.Media = function () { };
      hcap.Media.startUp = function (r) {
         hcap_call("media_startup", r)
      };
      hcap.Media.shutDown = function (r) {
         hcap_call("media_shutdown", r)
      };
      hcap.Media.createMedia = function (r) {
         if (r === null) {
            return hcap_media_obj
         }
         if (hcap_media_obj === null && r.url !== null && r.mimeType !== null) {
            hcap_media_obj = new hcap.Media();
            hcap_call("media_create_media", r);
            return hcap_media_obj
         }
         return null
      };
      hcap.Media.prototype.play = function (r) {
         if (hcap_media_obj === null) {
            r.onFailure({
               errorMessage: "already destroyed."
            });
            return
         }
         hcap_call("media_play", r)
      };
      hcap.Media.prototype.pause = function (r) {
         if (hcap_media_obj === null) {
            r.onFailure({
               errorMessage: "already destroyed."
            });
            return
         }
         hcap_call("media_pause", r)
      };
      hcap.Media.prototype.resume = function (r) {
         if (hcap_media_obj === null) {
            r.onFailure({
               errorMessage: "already destroyed."
            });
            return
         }
         hcap_call("media_resume", r)
      };
      hcap.Media.prototype.stop = function (r) {
         if (hcap_media_obj === null) {
            r.onFailure({
               errorMessage: "already destroyed."
            });
            return
         }
         hcap_call("media_stop", r)
      };
      hcap.Media.prototype.destroy = function (r) {
         if (hcap_media_obj === null) {
            r.onFailure({
               errorMessage: "already destroyed."
            });
            return
         }
         hcap_call("media_destroy", r);
         hcap_media_obj = null
      };
      hcap.Media.prototype.getInformation = function (r) {
         if (hcap_media_obj === null) {
            r.onFailure({
               errorMessage: "already destroyed."
            });
            return
         }
         hcap_call("media_get_information", r)
      };
      hcap.Media.prototype.getPlayPosition = function (r) {
         if (hcap_media_obj === null) {
            r.onFailure({
               errorMessage: "already destroyed."
            });
            return
         }
         hcap_call("media_get_play_position", r)
      };
      hcap.Media.prototype.setPlayPosition = function (r) {
         if (hcap_media_obj === null) {
            r.onFailure({
               errorMessage: "already destroyed."
            });
            return
         }
         hcap_call("media_set_play_position", r)
      };
      hcap.Media.prototype.getPlaySpeed = function (r) {
         if (hcap_media_obj === null) {
            r.onFailure({
               errorMessage: "already destroyed."
            });
            return
         }
         hcap_call("media_get_play_speed", r)
      };
      hcap.Media.prototype.setPlaySpeed = function (r) {
         if (hcap_media_obj === null) {
            r.onFailure({
               errorMessage: "already destroyed."
            });
            return
         }
         hcap_call("media_set_play_speed", r)
      };
      hcap.Media.prototype.setSubtitleOn = function (r) {
         if (hcap_media_obj === null) {
            r.onFailure({
               errorMessage: "already destroyed."
            });
            return
         }
         hcap_call("media_set_subtitle_on", r)
      };
      hcap.Media.prototype.getSubtitleOn = function (r) {
         if (hcap_media_obj === null) {
            r.onFailure({
               errorMessage: "already destroyed."
            });
            return
         }
         hcap_call("media_get_subtitle_on", r)
      };
      hcap.Media.prototype.setSubtitleUrl = function (r) {
         if (hcap_media_obj === null) {
            r.onFailure({
               errorMessage: "already destroyed."
            });
            return
         }
         hcap_call("media_set_subtitle_url", r)
      };
      hcap.Media.prototype.getState = function (r) {
         if (hcap_media_obj === null) {
            r.onFailure({
               errorMessage: "already destroyed."
            });
            return
         }
         hcap_call("media_get_state", r)
      };
      hcap.Media.prototype.getAudioLanguage = function (r) {
         hcap_call("media_get_audio_language", r)
      };
      hcap.Media.prototype.setAudioLanguage = function (r) {
         hcap_call("media_set_audio_language", r)
      };
      hcap.Media.prototype.getSubtitle = function (r) {
         if (hcap_media_obj === null) {
            r.onFailure({
               errorMessage: "already destroyed."
            });
            return
         }
         hcap_call("media_get_subtitle", r)
      };
      hcap.Media.prototype.setSubtitle = function (r) {
         if (hcap_media_obj === null) {
            r.onFailure({
               errorMessage: "already destroyed."
            });
            return
         }
         hcap_call("media_set_subtitle", r)
      };
      hcap.Media.SubtitleType = {
         NONE: 0,
         INTERNAL_SUBTITLE: 1,
         EXTERNAL_SUBTITLE: 2,
         CLOSED_CAPTION: 3
      };
      hcap.rms = {};
      hcap.rms.requestRms = function (r) {
         hcap_call("request_rms", r)
      };
      hcap.socket = {};
      hcap.socket.openUdpDaemon = function (r) {
         hcap_call("open_udp_daemon", r)
      };
      hcap.socket.closeUdpDaemon = function (r) {
         hcap_call("close_udp_daemon", r)
      };
      hcap.socket.openTcpDaemon = function (r) {
         hcap_call("open_tcp_daemon", r)
      };
      hcap.socket.closeTcpDaemon = function (r) {
         hcap_call("close_tcp_daemon", r)
      };
      hcap.socket.sendUdpData = function (r) {
         hcap_call("send_udp_data", r)
      };
      hcap.drm = {};
      hcap.drm.securemedia = {};
      hcap.drm.securemedia.initialize = function (r) {
         hcap_call("secure_media_drm_initialize", r)
      };
      hcap.drm.securemedia.unregister = function (r) {
         hcap_call("secure_media_drm_unregister", r)
      };
      hcap.drm.securemedia.isRegistration = function (r) {
         hcap_call("secure_media_drm_is_registration", r)
      };
      hcap.drm.securemedia.register = function (r) {
         hcap_call("secure_media_drm_register", r)
      };
      hcap.drm.securemedia.finalize = function (r) {
         hcap_call("secure_media_drm_finalize", r)
      };
      hcap.file = {};
      hcap.file.getUsbStorageList = function (r) {
         hcap_call("get_usb_storage_list", r)
      };
      hcap.file.getUsbStorageFileList = function (r) {
         hcap_call("get_usb_storage_file_list", r)
      };
      hcap.file.downloadFileToUsb = function (r) {
         hcap_call("download_file_to_usb", r)
      };
      hcap.file.deleteUsbFile = function (r) {
         hcap_call("delete_usb_file", r)
      };
      hcap.rs232c = {};
      hcap.rs232c.BaudRate = {
         BR_UNKNOWN: 0,
         BR_110: 110,
         BR_300: 300,
         BR_600: 600,
         BR_1200: 1200,
         BR_2400: 2400,
         BR_4800: 4800,
         BR_9600: 9600,
         BR_14400: 14400,
         BR_19200: 19200,
         BR_38400: 38400,
         BR_57600: 57600,
         BR_115200: 115200,
         BR_128000: 128000,
         BR_230400: 230400,
         BR_256000: 256000,
         BR_512000: 512000,
         BR_768000: 768000,
         BR_921600: 921600,
         BR_1024000: 1024000
      };
      hcap.rs232c.DataBit = {
         BIT_UNKNOWN: 0,
         BIT_7: 7,
         BIT_8: 8
      };
      hcap.rs232c.Parity = {
         UNKNOWN: 0,
         NONE: 1,
         EVEN: 2,
         ODD: 3
      };
      hcap.rs232c.StopBit = {
         UNKNOWN: 0,
         BIT_1: 1,
         BIT_2: 2
      };
      hcap.rs232c.FlowControl = {
         UNKNOWN: 0,
         NONE: 1,
         XON_XOFF: 2,
         HARDWARE: 3
      };
      hcap.rs232c.getConfiguration = function (r) {
         hcap_call("rs232c_get_configuration", r)
      };
      hcap.rs232c.setConfiguration = function (r) {
         hcap_call("rs232c_set_configuration", r)
      };
      hcap.rs232c.sendData = function (r) {
         hcap_call("rs232c_send_data", r)
      };
      hcap.rs232c.setStartupData = function (r) {
         hcap_call("rs232c_set_teaching_data", r)
      };
      hcap.rs232c.clearStartupData = function (r) {
         hcap_call("rs232c_clear_teaching_data", r)
      };
      hcap.system = {};
      hcap.system.requestScreenCaptureImage = function (r) {
         hcap_call("request_screen_capture_image", r)
      };
      hcap.system.getScreenCaptureImage = function (r) {
         hcap_call("get_screen_capture_image", r)
      };
      hcap.system.launchHcapHtmlApplication = function (r) {
         hcap_call("launch_hcap_html_application", r)
      };
      hcap.system.getMemoryUsage = function (r) {
         hcap_call("get_memory_usage", r)
      };
      hcap.system.getCpuUsage = function (r) {
         hcap_call("get_cpu_usage", r)
      };
      hcap.system.requestFocus = function (r) {
         hcap_call("request_focus", r)
      };
      hcap.system.getFocused = function (r) {
         hcap_call("get_focused", r)
      };
      hcap.system.requestCloning = function (r) {
         hcap_call("request_cloning", r)
      };
      hcap.system.getLocaleList = function (r) {
         hcap_call("get_locale_list", r)
      };
      hcap.system.getLocale = function (r) {
         hcap_call("get_locale", r)
      };
      hcap.system.requestLocaleChange = function (r) {
         hcap_call("request_locale_change", r)
      };
      hcap.system.getProcentricServer = function (r) {
         hcap_call("get_procentric_server", r)
      };
      hcap.system.setProcentricServer = function (r) {
         hcap_call("set_procentric_server", r)
      };
      hcap.system.SoundOutputType = {
         UNKNOWN: 0,
         INTERNAL_TV_SPEAKER: 1,
         WIRED_HEADPHONES: 2,
         OFF: 3,
         OPTICAL: 4,
         OPTICAL_LGSOUNDSYNC: 5,
         EXTERNAL_ARC: 6
      };
      hcap.system.getSoundOutput = function (r) {
         hcap_call("get_sound_output", r)
      };
      hcap.system.getDefaultSoundOutput = function (r) {
         hcap_call("get_default_sound_output", r)
      };
      hcap.system.setSoundOutput = function (r) {
         hcap_call("set_sound_output", r)
      };
      hcap.system.setDefaultSoundOutput = function (r) {
         hcap_call("set_default_sound_output", r)
      };
      hcap.system.beginDestroy = function (r) {
         hcap_call("begin_destroy", r)
      };
      hcap.system.endDestroy = function (r) {
         hcap_call("end_destroy", r)
      };
      hcap.system.getAudioPtsOffset = function (r) {
         hcap_call("get_audio_pts_offset", r)
      };
      hcap.system.setAudioPtsOffset = function (r) {
         hcap_call("set_audio_pts_offset", r)
      };
      hcap.system.getVideoPtsOffset = function (r) {
         hcap_call("get_video_pts_offset", r)
      };
      hcap.system.setVideoPtsOffset = function (r) {
         hcap_call("set_video_pts_offset", r)
      };
      hcap.system.getProxyServer = function (r) {
         hcap_call("get_proxy_server", r)
      };
      hcap.system.setProxyServer = function (r) {
         hcap_call("set_proxy_server", r)
      };
      hcap.system.expireProxyServer = function (r) {
         hcap_call("expire_proxy_server", r)
      };
      hcap.system.getBrowserDebugMode = function (r) {
         hcap_call("get_browser_debug_mode", r)
      };
      hcap.system.setBrowserDebugMode = function (r) {
         hcap_call("set_browser_debug_mode", r)
      };
      hcap.system.getNoSignalImage = function (r) {
         hcap_call("get_no_signal_image", r)
      };
      hcap.system.setNoSignalImage = function (r) {
         hcap_call("set_no_signal_image", r)
      };
      hcap.system.getScreenKeyboardLanguageList = function (r) {
         hcap_call("get_screen_keyboard_language_list", r)
      };
      hcap.system.setScreenKeyboardLanguage = function (r) {
         hcap_call("set_screen_keyboard_language", r)
      };
      hcap.system.getUsbPowerControl = function (r) {
         hcap_call("get_usb_power_control", r)
      };
      hcap.system.setUsbPowerControl = function (r) {
         hcap_call("set_usb_power_control", r)
      };
      hcap.system.showToastMessage = function (r) {
         hcap_call("show_toast_message", r)
      };
      hcap.system.startManualUpdate = function (r) {
         hcap_call("start_manual_update", r)
      };
      hcap.system.cancelUpdate = function (r) {
         hcap_call("cancel_update", r)
      };
      hcap.system.getUpdateProgress = function (r) {
         hcap_call("get_update_progress", r)
      };
      hcap.checkout = {};
      hcap.checkout.requestCheckout = function (r) {
         hcap_call("request_checkout", r)
      };
      hcap.checkout.takeCheckoutSnapshot = function (r) {
         hcap_call("take_checkout_snapshot", r)
      };
      hcap.beacon = {};
      hcap.beacon.setBeaconMode = function (r) {
         hcap_call("set_beacon_mode", r)
      };
      hcap.beacon.requestiBeacon = function (r) {
         hcap_call("request_iBeacon", r)
      };
      hcap.beacon.requestEddystoneUid = function (r) {
         hcap_call("request_eddystone_uid", r)
      };
      hcap.beacon.requestEddystoneUrl = function (r) {
         hcap_call("request_eddystone_url", r)
      };
      hcap.beacon.getBeaconInformation = function (r) {
         hcap_call("get_beacon_information", r)
      };
      hcap.beacon.startScan = function (r) {
         hcap_call("beacon_start_scan", r)
      };
      hcap.beacon.stopScan = function (r) {
         hcap_call("beacon_stop_scan", r)
      };
      hcap.bluetooth = {};
      hcap.bluetooth.setScanState = function (r) {
         hcap_call("bt_gap_set_scan_state", r)
      };
      hcap.bluetooth.disconnect = function (r) {
         hcap_call("bt_service_disconnect", r)
      };
      hcap.bluetooth.setBluetoothSoundSync = function (r) {
         hcap_call("set_bt_sound_sync", r)
      };
      hcap.bluetooth.getBluetoothSoundSync = function (r) {
         hcap_call("get_bt_sound_sync", r)
      };
      hcap.bluetooth.audio = {};
      hcap.bluetooth.audio.play = function (r) {
         hcap_call("bt_audio_play", r)
      };
      hcap.bluetooth.audio.stop = function (r) {
         hcap_call("bt_audio_stop", r)
      };
      hcap.bluetooth.audio.pause = function (r) {
         hcap_call("bt_audio_pause", r)
      };
      hcap.bluetooth.audio.forward = function (r) {
         hcap_call("bt_audio_forward", r)
      };
      hcap.bluetooth.audio.backward = function (r) {
         hcap_call("bt_audio_backward", r)
      };
      hcap.webrtc = {};
      hcap.webrtc.startPreviewVideo = function (r) {
         hcap_call("webrtc_start_preview_video", r)
      };
      hcap.webrtc.stopPreviewVideo = function (r) {
         hcap_call("webrtc_stop_preview_video", r)
      };
      hcap.webrtc.incomingCall = function (r) {
         hcap_call("webrtc_incoming_call", r)
      };
      hcap.webrtc.outgoingCall = function (r) {
         hcap_call("webrtc_outgoing_call", r)
      };
      hcap.webrtc.endCall = function (r) {
         hcap_call("webrtc_end_call", r)
      };
      hcap.webrtc.acceptMessage = function (r) {
         hcap_call("webrtc_accept_message", r)
      };
      hcap.webrtc.startCheckAudio = function (r) {
         hcap_call("webrtc_start_check_audio", r)
      };
      hcap.webrtc.stopCheckAudio = function (r) {
         hcap_call("webrtc_stop_check_audio", r)
      };
      hcap.webrtc.setConfiguration = function (r) {
         hcap_call("webrtc_set_configuration", r)
      };
      hcap.webrtc.getConfiguration = function (r) {
         hcap_call("webrtc_get_configuration", r)
      };
      hcap.webrtc.showDiagnostics = function (r) {
         hcap_call("webrtc_show_diagnostics", r)
      };
      hcap.security = {};
      hcap.security.registerServerCertificate = function (r) {
         hcap_call("register_server_certificate", r)
      };
      hcap.security.registerClientCertificate = function (r) {
         hcap_call("register_client_certificate", r)
      };
      hcap.security.unregisterServerCertificate = function (r) {
         hcap_call("unregister_server_certificate", r)
      };
      hcap.security.unregisterClientCertificate = function (r) {
         hcap_call("unregister_client_certificate", r)
      };
      hcap.security.existServerCertificate = function (r) {
         hcap_call("exist_server_certificate", r)
      };
      hcap.security.existClientCertificate = function (r) {
         hcap_call("exist_client_certificate", r)
      };
      hcap.iot = {};
      hcap.iot.requestSetBridgeStatus = function (r) {
         hcap_call("iot_request_set_bridge_status", r)
      };
      hcap.iot.getBridgeStatus = function (r) {
         hcap_call("iot_get_bridge_status", r)
      };
      hcap.iot.requestRegisterThing = function (r) {
         hcap_call("iot_request_register_thing", r)
      };
      hcap.iot.requestRejectThing = function (r) {
         hcap_call("iot_request_reject_thing", r)
      };
      hcap.iot.getThingList = function (r) {
         hcap_call("iot_get_thing_list", r)
      };
      hcap.iot.getBindingIdList = function (r) {
         hcap_call("iot_get_binding_id_list", r)
      };
      hcap.iot.requestSetComponent = function (r) {
         hcap_call("iot_request_set_component", r)
      };
      hcap.iot.requestUnregisterThing = function (r) {
         hcap_call("iot_request_unregister_thing", r)
      };
      hcap.iot.setThingNickname = function (r) {
         hcap_call("iot_set_thing_nickname", r)
      };
      hcap.iot.requestSynchronizeThing = function (r) {
         hcap_call("iot_request_synchronize_thing", r)
      };
      hcap.iot.getFrameworkStatus = function (r) {
         hcap_call("iot_get_framework_status", r)
      };
      hcap.iot.requestFactoryReset = function (r) {
         hcap_call("iot_request_factory_reset", r)
      };
      hcap.iot.getVersions = function (r) {
         hcap_call("iot_get_versions", r)
      };
      hcap.iot.getThingListPrivate = function (r) {
         hcap_call("iot_get_thing_list_private", r)
      };
      hcap.camera = {};
      hcap.camera.getCameraInformation = function (r) {
         hcap_call("get_camera_information", r)
      };
      hcap.camera.getCameraControl = function (r) {
         hcap_call("get_camera_control", r)
      };
      hcap.camera.setCameraControl = function (r) {
         hcap_call("set_camera_control", r)
      };
      hcap.speech = {};
      hcap.speech.setSpeechRecognition = function (r) {
         hcap_call("set_speech_recognition", r)
      };
      hcap.speech.getSpeechRecognition = function (r) {
         hcap_call("get_speech_recognition", r)
      };
      hcap.speech.HostType = {
         NOT_SUPPORT: 0,
         APPLICATION: 1,
         TV: 2
      };
      hcap.speech.decideHost = function (r) {
         hcap_call("decide_host", r)
      }
      hcap.wci = {};
      hcap.wci.getHcapSocketStatus = function () {
         return webSocket.readyState;
      };
      hcap.wci.getQueueLength = function () {
         return hcap_queue.length;
      };
      hcap.wci.isDev = function () {
         return isDev;
      };
      hcap.wci.toggleHcapLog = function (toggle) {
         //extDisableHcapConsole log logic is opposite of what function name would imply
         extDisableHcapConsoleLog = !toggle;
      }
      hcap.wci.setSupressMpiLog = function (toggle) {
         console.log("Setting supress mpi log " + toggle.toString());
         supress_mpi_log = toggle;
         return;
      }
   }())
};

export default hcap;