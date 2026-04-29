#!/usr/bin/env python3
import json
import math
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / 'scripts' / 'first-vocabulary.json').read_text(encoding='utf-8'))
OUT = ROOT / 'tmp' / 'first-vocabulary-images'
SIZE = 1024

PALETTES = [
    ('#fef3c7', '#fde68a', '#f9a8d4'),
    ('#dbeafe', '#bfdbfe', '#93c5fd'),
    ('#dcfce7', '#bbf7d0', '#86efac'),
    ('#fae8ff', '#f5d0fe', '#d8b4fe'),
]

def hx(color):
    color = color.lstrip('#')
    return tuple(int(color[i:i+2], 16) for i in (0, 2, 4))

def mix(a, b, t):
    return tuple(int(a[i] * (1 - t) + b[i] * t) for i in range(3))

def rounded(draw, xy, r, fill, outline=None, width=6):
    draw.rounded_rectangle(xy, radius=r, fill=fill, outline=outline, width=width)

def ellipse(draw, xy, fill, outline=None, width=6):
    draw.ellipse(xy, fill=fill, outline=outline, width=width)

def line(draw, pts, fill, width=18):
    draw.line(pts, fill=fill, width=width, joint='curve')

def face(draw, cx, cy, scale=1.0, dark=(69, 50, 46)):
    eye = int(14 * scale)
    ellipse(draw, (cx - int(52*scale), cy - int(18*scale), cx - int(52*scale)+eye, cy - int(18*scale)+eye), dark)
    ellipse(draw, (cx + int(38*scale), cy - int(18*scale), cx + int(38*scale)+eye, cy - int(18*scale)+eye), dark)
    draw.arc((cx - int(34*scale), cy - int(4*scale), cx + int(34*scale), cy + int(40*scale)), 10, 170, fill=dark, width=max(3, int(5*scale)))
    ellipse(draw, (cx - int(86*scale), cy + int(4*scale), cx - int(56*scale), cy + int(30*scale)), (255, 178, 190))
    ellipse(draw, (cx + int(58*scale), cy + int(4*scale), cx + int(88*scale), cy + int(30*scale)), (255, 178, 190))

def bg(idx):
    a, b, accent = [hx(c) for c in PALETTES[idx % len(PALETTES)]]
    img = Image.new('RGB', (SIZE, SIZE), a)
    pix = img.load()
    for y in range(SIZE):
        t = y / (SIZE - 1)
        col = mix(a, b, t)
        for x in range(SIZE):
            pix[x, y] = col
    d = ImageDraw.Draw(img)
    for i in range(18):
        x = (i * 173 + idx * 61) % SIZE
        y = (i * 97 + idx * 43) % SIZE
        r = 18 + (i * 7) % 32
        ellipse(d, (x-r, y-r, x+r, y+r), mix(accent, (255,255,255), 0.55))
    # soft ground
    ellipse(d, (-120, 740, 1144, 1150), mix(b, (255,255,255), 0.35))
    return img, d

def draw_star(d, cx, cy, r, fill):
    pts=[]
    for i in range(10):
        rr = r if i % 2 == 0 else r * 0.45
        a = -math.pi/2 + i * math.pi/5
        pts.append((cx + math.cos(a)*rr, cy + math.sin(a)*rr))
    d.polygon(pts, fill=fill)

def draw_object(d, kind, item, idx):
    dark = (74, 52, 43)
    outline = (92, 64, 51)
    if kind == 'desk':
        rounded(d, (250, 440, 774, 600), 34, (210, 153, 95), outline, 10); line(d, [(330,600),(300,770)], outline, 16); line(d, [(690,600),(720,770)], outline, 16); face(d,512,515,1.1,dark)
    elif kind == 'chair':
        rounded(d, (350, 315, 674, 565), 44, (244, 177, 131), outline, 10); rounded(d, (300,540,724,650), 34, (231, 145, 106), outline, 10); line(d,[(380,650),(350,770)],outline,16); line(d,[(644,650),(674,770)],outline,16); face(d,512,455,1.0,dark)
    elif kind == 'book':
        rounded(d,(275,330,735,690),38,(96,165,250),outline,10); line(d,[(512,340),(512,680)],(245,245,255),8); rounded(d,(315,380,470,435),14,(255,255,255),None,0); face(d,512,540,1.1,dark)
    elif kind == 'key':
        ellipse(d,(310,390,510,590),(250,204,21),outline,12); ellipse(d,(365,445,455,535),(255,245,180),outline,8); line(d,[(500,490),(750,490)],(250,204,21),40); line(d,[(690,490),(690,570)],outline,20); line(d,[(750,490),(750,545)],outline,20); face(d,410,500,0.7,dark)
    elif kind == 'clock':
        ellipse(d,(280,280,744,744),(255,255,255),outline,14); ellipse(d,(330,330,694,694),(254,243,199),None,0); line(d,[(512,512),(512,370)],outline,14); line(d,[(512,512),(625,570)],outline,14); face(d,512,585,1.0,dark)
    elif kind == 'window':
        rounded(d,(270,300,754,720),36,(186,230,253),outline,12); line(d,[(512,305),(512,715)],outline,10); line(d,[(275,510),(749,510)],outline,10); ellipse(d,(610,350,690,430),(253,224,71),None,0); face(d,512,610,0.9,dark)
    elif kind == 'door':
        rounded(d,(345,230,680,780),34,(180,116,75),outline,12); ellipse(d,(610,500,650,540),(250,204,21),outline,4); face(d,505,500,1.0,dark)
    elif kind == 'bag':
        rounded(d,(275,420,750,760),60,(244,114,182),outline,12); d.arc((390,290,635,520),200,340,fill=outline,width=18); face(d,512,585,1.1,dark)
    elif kind == 'phone':
        rounded(d,(365,235,660,795),54,(31,41,55),outline,10); rounded(d,(395,290,630,700),28,(186,230,253),None,0); ellipse(d,(492,720,532,760),(255,255,255),None,0); face(d,512,510,0.85,dark)
    elif kind == 'cup' or kind == 'tea':
        fill = (255,255,255) if kind=='cup' else (110,231,183)
        rounded(d,(320,390,650,690),48,fill,outline,12); d.arc((610,455,790,620),270,90,fill=outline,width=16); ellipse(d,(355,365,615,430),(166,120,86) if kind=='tea' else (219,234,254),outline,8); face(d,485,545,1.0,dark)
    elif kind == 'water':
        rounded(d,(365,250,660,770),80,(125,211,252),outline,12); ellipse(d,(405,300,620,510),(186,230,253),None,0); face(d,512,580,1.0,dark)
    elif kind == 'rice':
        rounded(d,(280,520,745,720),70,(255,255,255),outline,12); ellipse(d,(330,395,690,590),(255,255,255),outline,10); face(d,512,585,1.0,dark)
    elif kind == 'bread':
        rounded(d,(300,390,724,690),80,(251,191,36),outline,12); rounded(d,(355,455,670,690),40,(245,158,11),None,0); face(d,512,555,1.0,dark)
    elif kind == 'apple':
        ellipse(d,(315,360,710,760),(239,68,68),outline,12); line(d,[(515,365),(565,285)],outline,16); ellipse(d,(555,275,665,350),(34,197,94),outline,8); face(d,512,560,1.1,dark)
    elif kind == 'banana':
        d.arc((250,240,850,760),35,155,fill=(250,204,21),width=105); d.arc((300,300,800,700),35,155,fill=outline,width=12); face(d,512,575,0.9,dark)
    elif kind == 'egg':
        ellipse(d,(340,270,685,770),(255,255,245),outline,12); ellipse(d,(430,500,595,665),(250,204,21),None,0); face(d,512,445,0.9,dark)
    elif kind == 'fish':
        ellipse(d,(280,390,690,650),(96,165,250),outline,12); d.polygon([(680,520),(820,405),(820,635)],fill=(59,130,246),outline=outline); ellipse(d,(360,470,405,515),dark); face(d,500,565,0.8,dark)
    elif kind == 'meat':
        ellipse(d,(310,390,710,680),(248,113,113),outline,12); ellipse(d,(410,485,590,610),(254,226,226),outline,8); face(d,512,540,0.9,dark)
    elif kind == 'cake':
        rounded(d,(310,420,720,710),42,(252,165,165),outline,12); rounded(d,(350,335,680,470),36,(255,255,255),outline,8); line(d,[(512,335),(512,250)],(248,113,113),12); ellipse(d,(488,220,536,270),(250,204,21),None,0); face(d,512,570,1.0,dark)
    elif kind == 'color':
        col = hx(item.get('color','#60a5fa'))
        ellipse(d,(300,300,724,724),col,outline,14); ellipse(d,(390,255,500,365),mix(col,(255,255,255),0.35),None,0); face(d,512,530,1.2,(255,255,255) if sum(col)<180 else dark)
    elif kind == 'number':
        n = item.get('number',1); colors=[(244,114,182),(96,165,250),(52,211,153),(250,204,21)]
        cols = min(5, n); rows = math.ceil(n/cols); spacing=115; startx=512-(cols-1)*spacing/2; starty=455-(rows-1)*spacing/2
        for i in range(n):
            x=startx+(i%cols)*spacing; y=starty+(i//cols)*spacing
            draw_star(d,x,y,42,colors[i%len(colors)])
        rounded(d,(350,610,675,760),55,(255,255,255),outline,10); face(d,512,690,0.9,dark)
    else:
        ellipse(d,(300,300,724,724),(147,197,253),outline,12); face(d,512,530,1.2,dark)

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    idx = 0
    for group in DATA['groups']:
        for item in group['items']:
            img, d = bg(idx)
            draw_object(d, item.get('kind'), item, idx)
            # subtle sparkle foreground
            for k in range(5):
                draw_star(d, 160 + k*170, 180 + ((idx+k)*73)%120, 18, (255,255,255))
            img.save(OUT / f"{item['slug']}.jpg", 'JPEG', quality=92, optimize=True)
            idx += 1
    print(f"generated {idx} images in {OUT}")

if __name__ == '__main__':
    main()
