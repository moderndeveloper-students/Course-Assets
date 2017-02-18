describe('App', function () {
  beforeEach(function () {
    spyOn(console, 'log');
  });

  it('should log a message on startup', function () {
    app.bootstrap();
    expect(console.log).toHaveBeenCalledWith(app.startupMessage);
  });

  it('should log a message on shutdown', function () {
    app.stop();
    expect(console.log).toHaveBeenCalledWith(app.shutdownMessage);
  });
});