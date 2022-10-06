import win32api, win32con
def click(x,y):
    win32api.SetCursorPos((x,y))
    print('1')
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN,x,y,0,0)
    print('2')
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP,x,y,0,0)
    print('3')
click(100,100)