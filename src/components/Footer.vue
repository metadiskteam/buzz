<template>
	<div class="footer-wrapper">
		<div class="copy-right-wrapper">
			<div class="copy-right">
				<span>{{$t('components_footer_308')}}</span>
				<p class="tip-website">{{$t('components_footer_309')}}</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Footer',
	data() {
		return {}
	}
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';

.footer-wrapper {
  margin-top: 20px;
  display: flex;

  .copy-right-wrapper {
    width: 100%;
    color: $BorderLight;
    background: linear-gradient(to right, $Primary, #66b1ff);
    padding: 16px 0 16px 5vw;
    font-size: 14px;
    color: $BorderLight;
    display: flex;
    align-items: center;

    .logo {
      width: 240px;
      display: block;
      @media screen and (max-width: 920px) {
        width: 160px;
      }
    }

    .split {
      margin: 0 8px;
    }

    .link {
      &:hover {
        text-decoration: underline;
      }
    }

    .tip-website {
      padding-top: 8px;
    }
  }

  .join-us {
    background: linear-gradient(to right, $Placeholder, $Info);
    width: 35%;
    padding: 16px 5vw 16px 40px;
    color: #fff;

    .join-list {
      margin-top: 16px;
      display: flex;
      list-style: none;

      .join-item {
        .iconfont {
          margin-right: 16px;
          font-size: 30px;
          cursor: pointer;
        }

        .qq {
          &:hover {
            color: $Primary;
          }
        }

        .wechat {
          &:hover {
            color: $Success;
          }
        }

        .gitee {
          &:hover {
            color: #c71d24;
          }
        }
      }
    }
  }
}
</style>
