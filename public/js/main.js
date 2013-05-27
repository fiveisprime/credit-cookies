var Movie = Backbone.Model.extend();

var MovieCollection = Backbone.Collection.extend({
  model: Movie
, url: '/movies'
});

var MovieView = Backbone.View.extend({
  template: _.template($('#movie').html())
, render: function() {
    return this.template(this.model.toJSON());
  }
});

var AppView = Backbone.View.extend({
  el: '.container'
, events: {
    'click #add': 'addMovie'
  }
, initialize: function() {
    this.render();
  }
, render: function() {
    var _this = this;
    this.model.fetch().complete(function() {
      _.each(_this.model.models, function(movie) {
        $(_this.el).append(new MovieView({ model: movie }).render());
      });
    });
    return this;
  }
, addMovie: function(e) {
    e.preventDefault && e.preventDefault();
    // TODO: add a new movie here.
    return false;
  }
})

appView = new AppView({ model: new MovieCollection() });
