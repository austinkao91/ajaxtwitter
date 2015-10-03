$.FollowToggle = function (el) {
  this.$el = $(el);

  this.userId = this.$el.data("user-id");
  this.followState = this.$el.data("initial-follow-state");
  this.render();
  this.$el.on("click", this.handleClick.bind(this));
};

$.FollowToggle.prototype.render = function () {
  if (this.followState === "unfollowed") {
    this.$el.html("Follow");
    this.$el.prop("disabled", false);
  } else if (this.followState === "followed") {
    this.$el.prop("disabled", false);
    this.$el.html("Unfollow");
  } else  {
    this.$el.prop("disabled", true);
  }
};

$.FollowToggle.prototype.toggle = function() {
  if( this.followState === "unfollowing") {
    this.followState = "unfollowed";
  } else if (this.followState === "following"){
    this.followState = "followed";
  }
};

$.FollowToggle.prototype.handleClick = function(e) {
  e.preventDefault();

  var ourMethod;
  if (this.followState === "followed") {
    ourMethod = "DELETE";
    this.followState = "unfollowing";
  } else if(this.followState === "unfollowed") {
    ourMethod = "POST";
    this.followState = "following";
  }
  this.render();

  $.ajax( {
    method: ourMethod,
    url: this.userId + "/follow",
    dataType: "json",
    success: function(responseData) {
      this.toggle();
      this.render();
    }.bind(this),
    failure: function(responseData) {
      console.log("FAILED");
    }
  });
};

$.fn.followToggle = function () {
  return this.each(function () {
    new $.FollowToggle(this);
  });
};

$(function () {
  $("button.follow-toggle").followToggle();
});
