jest.useFakeTimers();

test("computer turn is delayed", () => {
  const spy = jest.spyOn(global, "setTimeout");

  setTimeout(() => {}, 400);

  expect(spy).toHaveBeenCalledWith(expect.any(Function), 400);

  jest.runAllTimers();
  spy.mockRestore();
});
