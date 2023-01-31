import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

const font = fetch(new URL('../../assets/Pretendard-Regular.ttf', import.meta.url)).then((res) => res.arrayBuffer());

export default async function handler(req: NextRequest) {
  const fontData = await font;

  try {
    const { searchParams } = new URL(req.url);

    const hasText = searchParams.has('text');
    const text = hasText ? `${searchParams.get('text')?.substring(0, 170)}` : '';

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: 'white',
            width: '100%',
            height: '100%',
            padding: '50px 25px 25px',
            display: 'flex',
          }}
        >
          <svg width="1150" height="606" viewBox="0 0 1150 606" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 37C0 16.5655 16.5655 0 37 0H1113C1133.43 0 1150 16.5655 1150 37V464C1150 484.435 1133.48 501 1113.04 501C1025.72 501 888.341 501 828.625 501C795.794 501 863.592 542.028 858.931 566.985C857.851 572.768 851.594 575.566 845.741 576.157C781.537 582.645 647.127 501 613 501C397.955 501 292.782 501 37.1187 501C16.6842 501 0 484.435 0 464V37Z"
              fill="#FFB86C"
            />
            <path
              d="M886.766 587H910.75C923.523 587 930.242 580.359 930.281 571.375C930.242 563.016 924.227 557.938 917.859 557.625V557.078C923.68 555.789 928.055 551.609 928.016 544.969C928.055 536.453 921.727 530.438 909.266 530.438H886.766V587ZM898.484 577.312V562.156H908.719C914.5 562.156 918.133 565.516 918.094 570.281C918.133 574.539 915.203 577.352 908.406 577.312H898.484ZM898.484 554.109V539.969H907.781C913.133 539.969 916.18 542.742 916.141 546.844C916.18 551.375 912.469 554.148 907.547 554.109H898.484ZM949.031 530.438H937.469V587H949.031V530.438ZM955.984 575.125C956.023 583.523 962 587.82 970.125 587.781C976.414 587.82 980.477 585.047 982.547 581.141H982.859V587H993.797V558.406C993.836 548.172 985.086 544.031 975.828 544.031C964.578 544.031 958.172 549.812 957.469 557.156H968.484C969.109 554.266 971.57 552.508 975.516 552.469C979.852 552.508 982.273 554.539 982.312 558.094V561.531C980.516 561.609 974.812 561.883 971.766 562.078C963.602 562.586 956.023 565.672 955.984 575.125ZM967.078 574.812C967.078 571.531 969.617 569.617 973.641 569.266C975.594 569.109 980.555 568.836 982.312 568.758V571.844C982.352 576.336 978.68 579.773 973.406 579.812C969.695 579.773 967.078 578.055 967.078 574.812ZM1014.19 562.469C1014.19 556.883 1017.59 553.641 1022.47 553.641C1027.31 553.641 1030.12 556.727 1030.12 562V587H1041.69V559.969C1041.69 550.008 1035.87 544.031 1027 544.031C1020.55 544.031 1016.3 547.039 1014.34 552H1013.88V530.438H1002.62V587H1014.19V562.469ZM1061.69 530.438H1048.33L1065.75 558.719L1048.02 587H1061.53L1073.25 567.547H1073.64L1085.36 587H1098.95L1081.3 558.719L1098.56 530.438H1085.28L1073.64 549.891H1073.25L1061.69 530.438ZM1105.36 587H1145.83V577.312H1121.69V577L1130.28 568.641C1141.92 558.094 1145.05 552.82 1145.05 546.375C1145.05 536.57 1137 529.656 1124.89 529.656C1112.98 529.656 1104.77 536.727 1104.81 547.781H1115.98C1115.95 542.352 1119.42 538.992 1124.73 539.031C1129.93 538.992 1133.72 542.117 1133.72 547.156C1133.72 551.648 1130.87 554.773 1125.59 559.812L1105.28 578.484L1105.36 587Z"
              fill="black"
            />
          </svg>
          <p
            style={{
              whiteSpace: 'pre-line',
              padding: '60px',
              position: 'absolute',
              fontSize: '54px',
              color: 'black',
              zIndex: 10,
              width: '100%',
              fontFamily: 'Pretendard',
            }}
          >
            {text}
          </p>
        </div>
      ),
      {
        width: 1200,
        height: 681,
        fonts: [
          {
            name: 'Pretendard',
            data: fontData,
            style: 'normal',
          },
        ],
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response('Failed to generate the image', {
      status: 500,
    });
  }
}