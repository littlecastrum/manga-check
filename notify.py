import subprocess

def notify(notification):
	title = 'Mangas updated'
	action = f'display notification "{notification}" with title "{title}"'
	script = f'osascript -e \'{action}\''
	print(notification)
	os.system(script)

(response, err) = subprocess.Popen(["mangas -n"], stdout=subprocess.PIPE, shell=True).communicate()


notify(response.decode("utf-8"))