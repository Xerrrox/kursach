var current = window.location.hash.split('_')[0];
var id = window.location.hash.split('_')[1];
if(current != "") {
    switchTab(current);
} else {
    switchTab("#home");
}

function linkClicked(e) {
    id = e.href.split('_')[1];
    switchTab("#" + e.href.split("#")[1].split('_')[0]);
}

function switchTab(newtab) { //переключение по вкладкам 
    $(".menu-tab").removeClass("active");
    $(".menu-tab-item").hide();
    if(!$(".menu-tab-item" + newtab).length) {
        $(".menu-tab").first().addClass("active");
        $(".menu-tab-item").first().fadeIn();
        $(".menu-tab-item").not(":first").hide();
        if($(".menu-tab").first().attr("menu-tab-title") != undefined) {
            $("title").html($(".menu-tab").first().attr("menu-tab-title") + " | " + $("title").text().split(' | ')[1]);
        }
    } else {
        $(".menu-tab[href='" + newtab + "']").addClass("active");
        $(".menu-tab-item" + newtab).fadeIn();
        if($(".menu-tab[href='" + newtab + "']").attr("menu-tab-title") != undefined) {
            $("title").html($(".menu-tab[href='" + newtab + "']").attr("menu-tab-title") + " | " + $("title").text().split(' | ')[1]);
        }
        onTabSwitched(newtab); //колбэк
    }
}