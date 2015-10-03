$.UserSearch = function(el) {
  this.$el = $(el);
  this.$input = $(".search");
  this.$ul = $("ul.users");
  this.$input.on("input", this.handleInput.bind(this));
};

$.UserSearch.prototype.handleInput = function(e) {

  $.ajax({
    url: "/users/search",
    method: "get",
    data: {"query": this.$input.val()},
    dataType: "json",
    success: function(data){
      return this.renderResults(data);
    }.bind(this),
    failure: function(data) {
      alert("OH NOOOÖ");
    }
  });
};

$.UserSearch.prototype.renderResults = function(data){
  this.$ul.html("");
  var that = this;

  data.forEach(function(result) {
    var following;
    if(result.followed) {
      following = "followed";
    } else {
      following = "unfollowed";
    }
    var toAppend = "<li><a href='/users/" + result.id + "'>" + result.username + "</a></li><button class ='follow-toggle' data-initial-follow-state='" + following + "' data-user-id ='" + result.id + "'></button>";

    that.$ul.append(toAppend);
  });
  $("button.follow-toggle").followToggle();
};



$.fn.userSearch = function() {
  return this.each(function(){
    new $.UserSearch(this);
  });
};


$(function () {
  $(".users-search").userSearch();
});
