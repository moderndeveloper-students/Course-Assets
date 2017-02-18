(function (w) {
  w.app = {
    // Message to display
    startupMessage: 'Houston we have liftoff',
    shutdownMessage: 'Houston we have landed',
    /**
     * Initial startup method. 
     * Initializes app and prepares any necessary configuratio
    **/
    bootstrap: function () {
      console.log(this.startupMessage);
      this.$running = true;
    },
    stop: function () {
      if (this.$running) {
        console.log(this.shutdownMessage);
        this.$running = false;
      }
    }
  }
})(window);