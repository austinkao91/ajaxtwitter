$.TweetCompose = function(el) {
  this.$el = $(el);
  this.$feedUl = $(this.$el.data('ul-id'));
  this.charLeft = 140;
  this.$el.on("submit", this.submit.bind(this));
  this.$el.on("input", this.wordCount.bind(this));
  $("a.add-mentioned-user").on("click", this.addMentionedUser.bind(this));

};

$.TweetCompose.prototype.wordCount = function(event) {
  var length = $('.tweet-content').val().length;
  var charsLeft = Math.max(0, 140 - length);
  $(".chars-left").html(charsLeft + " characters remaining");
  if (length > 140) {
    $(".tweet-content").val($(".tweet-content").val().slice(0,140));
  }
};

$.TweetCompose.prototype.addMentionedUser = function () {
  var template = $(".mention-template");
  $(".mentioned-users").append(template.html());
  $("a.remove-user").on("click", this.removeMentionedUser.bind(this));
};

$.TweetCompose.prototype.removeMentionedUser = function (e) {
  e.preventDefault();
  $(e.currentTarget).parent().remove();
};

$.TweetCompose.prototype.submit = function(event){
  event.preventDefault();

  var val = $('.tweet-content').val();
  var mentions = $('.tweet-mentions').val();
  $(":input").prop("disabled",true);
  $.ajax({
    method: "POST",
    url: "/tweets",
    dataType: "json",
    data: {
      tweet: {
        'content': val.slice(0,140)
       }
    },
    success: function(data){
      this.handleSuccess(data);
    }.bind(this),
    failure: function(data) {
      alert(" You failed");
      console.log(data);
    }
  });

};

$.TweetCompose.prototype.clearInput = function() {
  // debugger;
    $('.tweet-content, .tweet-mentions').val("");
};

$.TweetCompose.prototype.handleSuccess = function(data) {
  this.clearInput();
  $(":input").prop("disabled",false);
  this.render(data);
};

$.TweetCompose.prototype.render = function(data) {
  var toPrepend = "<li>" + data.content +
   " -- <a href='/users/" +
   data.id + "'>" + data.user.username +
   "</a> -- " +
   data.updated_at +
   "</li>";
  this.$feedUl.prepend(toPrepend);

};

$.fn.tweetCompose = function() {
  return this.each(function(){
    new $.TweetCompose(this);
  });
};

$(function() {
  $(".tweet-compose").tweetCompose();
});
