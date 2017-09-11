/**
 * Created by wangbaoqi on 5/8/17.
 */
import $ from 'jquery'

export default {
    setCookie: function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    },
    GetCookieValue: function (name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = $.trim(cookies[i]);
                //PYYH=USERNAME=steven&PASSWORD=111111&UserID=1&UserType=1
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    //USERNAME=steven&PASSWORD=111111&UserID=1&UserType=1
                    break;
                }
            }
        }
        return cookieValue;
    }

};
