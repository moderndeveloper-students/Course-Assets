describe('App', function () {
  beforeEach(function () {
    spyOn(console, 'log');
  });

  if('should log a message on startup', function () {
    app.bootstrap();
    expect(console.log).toHaveBeenCalledWith(app.startupMessage);
  });

    if('should log a message on shutdown', function () {
    app.stop();
    expect(console.log).toHaveBeenCalledWith(app.shutdownMessage);
  });
});